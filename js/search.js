/**
 * search.js — Full-text search using lunr.js
 *
 * Builds a lunr.js index from window.SITE_DATA (assets, faqItems, debunkingMyths).
 * Listens for input on #search-input and renders results in a dropdown.
 *
 * Features:
 *   - Debounced input (200ms)
 *   - Keyboard navigation (arrow keys + Enter)
 *   - XSS-safe HTML escaping
 *   - Path resolution for root, pages/, and es/ directories
 */
(function () {
  'use strict';

  // Wait for DOM + data
  document.addEventListener('DOMContentLoaded', function () {
    var data = window.SITE_DATA;
    if (!data || typeof lunr === 'undefined') return;

    var searchInput = document.getElementById('search-input');
    var searchOverlay = document.getElementById('search-overlay');
    if (!searchInput || !searchOverlay) return;

    // -----------------------------------------------------------------------
    // 1. CREATE RESULTS CONTAINER
    // -----------------------------------------------------------------------
    var overlayContainer = searchOverlay.querySelector('.container');
    var resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.className = 'search-results';
    resultsContainer.setAttribute('role', 'listbox');
    resultsContainer.setAttribute('aria-label', 'Search results');
    overlayContainer.appendChild(resultsContainer);

    // -----------------------------------------------------------------------
    // 2. BUILD DOCUMENT LIST FOR INDEXING
    // -----------------------------------------------------------------------
    var documents = [];

    // Index assets
    data.assets.forEach(function (asset) {
      documents.push({
        id: 'asset-' + asset.id,
        type: 'asset',
        title: asset.title,
        description: asset.description,
        body: asset.tags.join(' ') + ' ' + asset.category,
        asset: asset
      });
    });

    // Index FAQ items
    data.faqItems.forEach(function (item, i) {
      documents.push({
        id: 'faq-' + i,
        type: 'faq',
        title: item.question,
        description: item.answer.substring(0, 150) + '...',
        body: item.answer,
        item: item
      });
    });

    // Index debunking myths
    data.debunkingMyths.forEach(function (item, i) {
      documents.push({
        id: 'myth-' + i,
        type: 'myth',
        title: 'Myth: ' + item.myth,
        description: item.fact.substring(0, 150) + '...',
        body: item.fact + ' ' + item.source,
        item: item
      });
    });

    // -----------------------------------------------------------------------
    // 3. BUILD LUNR INDEX
    // -----------------------------------------------------------------------
    var idx = lunr(function () {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('description', { boost: 5 });
      this.field('body');

      documents.forEach(function (doc) {
        this.add(doc);
      }, this);
    });

    // Create a lookup map for quick document retrieval by id
    var docMap = {};
    documents.forEach(function (doc) {
      docMap[doc.id] = doc;
    });

    // -----------------------------------------------------------------------
    // 4. HELPER FUNCTIONS
    // -----------------------------------------------------------------------

    /**
     * Escape HTML to prevent XSS in search results.
     */
    function escapeHTML(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    /**
     * Resolve a path relative to root, accounting for current directory depth.
     * Paths passed in should be from root perspective (e.g. 'pages/qa.html').
     */
    function resolvePath(path) {
      var loc = window.location.pathname;
      var isInPages = loc.indexOf('/pages/') !== -1;
      var isInEs = loc.indexOf('/es/') !== -1;

      if (isInPages) {
        // We are in pages/ — strip the 'pages/' prefix
        return path.replace('pages/', '');
      } else if (isInEs) {
        // We are in es/ — go up one level
        return '../' + path;
      }
      // We are at root
      return path;
    }

    /**
     * Category-to-page mapping for assets without direct links.
     */
    var categoryPageMap = {
      'own-projects':   'pages/books.html',
      'book-changes':   'pages/books.html',
      'original-books': 'pages/books.html',
      'archives':       'pages/tools.html',
      'audio-video':    'pages/audio.html',
      'documents':      'pages/documents.html',
      'preservation':   'pages/community.html',
      'historical':     'pages/documents.html',
      'community':      'pages/community.html',
      'philosophical':  'pages/books.html'
    };

    /**
     * Determine the URL for a search result document.
     */
    function getResultUrl(doc) {
      if (doc.type === 'faq') {
        return resolvePath('pages/qa.html');
      }
      if (doc.type === 'myth') {
        return resolvePath('pages/debunking.html');
      }
      // Asset type
      var asset = doc.asset;
      if (asset && asset.links && asset.links.length > 0) {
        return asset.links[0].url;
      }
      // Fallback to category page
      if (asset && categoryPageMap[asset.category]) {
        return resolvePath(categoryPageMap[asset.category]);
      }
      return resolvePath('index.html');
    }

    /**
     * Get a human-readable type badge label for a document.
     */
    function getTypeBadge(doc) {
      if (doc.type === 'faq') return 'Q&A';
      if (doc.type === 'myth') return 'Evidence';
      // For assets, use category label
      if (doc.asset && data.categories[doc.asset.category]) {
        return data.categories[doc.asset.category].label;
      }
      return 'Resource';
    }

    /**
     * Check if URL is external (starts with http/https).
     */
    function isExternalUrl(url) {
      return /^https?:\/\//.test(url);
    }

    // -----------------------------------------------------------------------
    // 5. RENDER SEARCH RESULTS
    // -----------------------------------------------------------------------
    var focusedIndex = -1;

    function renderResults(query) {
      focusedIndex = -1;

      if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('has-results');
        return;
      }

      var results;
      try {
        // Use wildcard search for partial matching, fall back to plain search
        results = idx.search(query + '*');
        if (results.length === 0) {
          results = idx.search(query);
        }
      } catch (e) {
        // If lunr throws on bad query syntax, try escaping special chars
        try {
          var safeQuery = query.replace(/[:\*\~\+\-\^]/g, ' ').trim();
          if (safeQuery) {
            results = idx.search(safeQuery);
          } else {
            results = [];
          }
        } catch (e2) {
          results = [];
        }
      }

      if (results.length === 0) {
        resultsContainer.innerHTML =
          '<div class="search-empty">No results found for \'' +
          escapeHTML(query) + '\'</div>';
        resultsContainer.classList.add('has-results');
        return;
      }

      // Limit to top 10 results
      var topResults = results.slice(0, 10);
      var html = '';

      topResults.forEach(function (result, i) {
        var doc = docMap[result.ref];
        if (!doc) return;

        var url = getResultUrl(doc);
        var badge = getTypeBadge(doc);
        var title = escapeHTML(doc.title);
        var desc = escapeHTML(doc.description);
        var isExternal = isExternalUrl(url);
        var targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

        html +=
          '<a href="' + escapeHTML(url) + '"' + targetAttr +
          ' class="search-result-item" role="option" data-index="' + i + '">' +
          '<span class="search-result-type">' + escapeHTML(badge) + '</span>' +
          '<span class="search-result-title">' + title + '</span>' +
          '<span class="search-result-desc">' + desc + '</span>' +
          '</a>';
      });

      resultsContainer.innerHTML = html;
      resultsContainer.classList.add('has-results');
    }

    // -----------------------------------------------------------------------
    // 6. DEBOUNCED INPUT HANDLER
    // -----------------------------------------------------------------------
    var debounceTimer = null;

    searchInput.addEventListener('input', function () {
      var query = searchInput.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        renderResults(query);
      }, 200);
    });

    // Also handle the 'search' event (triggered when user clears with the X button)
    searchInput.addEventListener('search', function () {
      clearTimeout(debounceTimer);
      renderResults(searchInput.value);
    });

    // -----------------------------------------------------------------------
    // 7. KEYBOARD NAVIGATION
    // -----------------------------------------------------------------------
    function getResultItems() {
      return resultsContainer.querySelectorAll('.search-result-item');
    }

    function setFocus(index) {
      var items = getResultItems();
      // Remove previous focus
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('is-focused');
      }
      if (index >= 0 && index < items.length) {
        focusedIndex = index;
        items[index].classList.add('is-focused');
        // Scroll into view if needed
        items[index].scrollIntoView({ block: 'nearest' });
      } else {
        focusedIndex = -1;
      }
    }

    searchInput.addEventListener('keydown', function (e) {
      var items = getResultItems();
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = focusedIndex + 1;
        if (next >= items.length) next = 0;
        setFocus(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = focusedIndex - 1;
        if (prev < 0) prev = items.length - 1;
        setFocus(prev);
      } else if (e.key === 'Enter') {
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          e.preventDefault();
          items[focusedIndex].click();
        }
      }
    });

    // -----------------------------------------------------------------------
    // 8. CLEAR RESULTS WHEN OVERLAY CLOSES
    // -----------------------------------------------------------------------
    // Use a MutationObserver to detect when the overlay loses its .is-open class
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          if (!searchOverlay.classList.contains('is-open')) {
            // Overlay was closed — clear results and input
            searchInput.value = '';
            resultsContainer.innerHTML = '';
            resultsContainer.classList.remove('has-results');
            focusedIndex = -1;
          }
        }
      });
    });
    observer.observe(searchOverlay, { attributes: true });
  });
})();
