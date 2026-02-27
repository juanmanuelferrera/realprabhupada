/**
 * cards.js — Reusable card rendering module for category pages
 *
 * Provides:
 *   - CardRenderer.renderCards(containerId, assets, categories)
 *   - CardRenderer.createCard(asset, categories)
 *   - CardRenderer.renderFilters(containerId, categories, activeCategory, onFilter)
 *
 * Depends on: window.SITE_DATA (loaded via data.js)
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helper: escape HTML entities to prevent XSS
  // ---------------------------------------------------------------------------
  function esc(str) {
    if (typeof str !== 'string') return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Helper: map format string to CSS modifier class
  // ---------------------------------------------------------------------------
  function formatClass(fmt) {
    var map = {
      pdf:       'format-badge--pdf',
      kindle:    'format-badge--kindle',
      paperback: 'format-badge--paperback',
      hardcover: 'format-badge--paperback',
      online:    'format-badge--online',
      audio:     'format-badge--audio',
      video:     'format-badge--audio'
    };
    return map[fmt] || '';
  }

  // ---------------------------------------------------------------------------
  // Helper: get category metadata
  // ---------------------------------------------------------------------------
  function getCategoryMeta(asset, categories) {
    if (categories && categories[asset.category]) {
      return categories[asset.category];
    }
    return { label: asset.category || 'Resource', icon: '', color: '' };
  }

  // ---------------------------------------------------------------------------
  // createCard — Build a single card HTML string from an asset object
  // ---------------------------------------------------------------------------
  function createCard(asset, categories) {
    var cat = getCategoryMeta(asset, categories);
    var html = '';

    html += '<article class="card">';

    // Category badge with color modifier
    html += '<span class="card-badge card-badge--' + esc(cat.color) + '">';
    html += esc(cat.icon + ' ' + cat.label);
    html += '</span>';

    // Title (linked to first URL if available)
    html += '<h3 class="card-title">';
    if (asset.hasUrl && asset.links && asset.links.length > 0) {
      html += '<a href="' + esc(asset.links[0].url) + '" target="_blank" rel="noopener noreferrer">';
      html += esc(asset.title);
      html += '</a>';
    } else {
      html += esc(asset.title);
    }
    html += '</h3>';

    // Description
    html += '<p class="card-description">' + esc(asset.description) + '</p>';

    // Format badges
    if (asset.formats && asset.formats.length > 0) {
      html += '<div class="card-formats">';
      for (var k = 0; k < asset.formats.length; k++) {
        var fmt = asset.formats[k];
        html += '<span class="format-badge ' + formatClass(fmt) + '">' + esc(fmt) + '</span> ';
      }
      html += '</div>';
    }

    // Action buttons or "coming soon" notice
    if (asset.hasUrl && asset.links && asset.links.length > 0) {
      html += '<div class="card-actions">';
      for (var m = 0; m < asset.links.length; m++) {
        var link = asset.links[m];
        html += '<a href="' + esc(link.url) + '" class="btn btn-sm" target="_blank" rel="noopener noreferrer">';
        html += esc(link.label);
        html += '</a>';
      }
      html += '</div>';
    } else {
      html += '<div class="card-actions">';
      html += '<span class="card-coming-soon">Available through Vedabase</span>';
      html += '</div>';
    }

    html += '</article>';
    return html;
  }

  // ---------------------------------------------------------------------------
  // renderCards — Render an array of assets as cards into a container element
  // ---------------------------------------------------------------------------
  function renderCards(containerId, assets, categories) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (!assets || assets.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">No resources found.</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < assets.length; i++) {
      html += createCard(assets[i], categories);
    }
    container.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // renderFilters — Render category filter tabs
  // ---------------------------------------------------------------------------
  function renderFilters(containerId, filterCategories, activeCategory, onFilter) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<div class="filter-tabs">';

    for (var i = 0; i < filterCategories.length; i++) {
      var cat = filterCategories[i];
      var isActive = (cat.key === activeCategory) ? ' active' : '';
      html += '<button class="filter-tab' + isActive + '" data-category="' + esc(cat.key) + '">';
      html += esc(cat.label);
      html += '</button>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Attach click handlers via event delegation
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-tab');
      if (!btn) return;

      // Update active state
      var tabs = container.querySelectorAll('.filter-tab');
      for (var j = 0; j < tabs.length; j++) {
        tabs[j].classList.remove('active');
      }
      btn.classList.add('active');

      // Invoke callback
      var selectedCategory = btn.getAttribute('data-category');
      if (typeof onFilter === 'function') {
        onFilter(selectedCategory);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // getAssetsByIds — Helper to filter assets by an array of IDs
  // ---------------------------------------------------------------------------
  function getAssetsByIds(allAssets, ids) {
    var result = [];
    for (var i = 0; i < allAssets.length; i++) {
      for (var j = 0; j < ids.length; j++) {
        if (allAssets[i].id === ids[j]) {
          result.push(allAssets[i]);
          break;
        }
      }
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // getAssetsByCategory — Helper to filter assets by category key
  // ---------------------------------------------------------------------------
  function getAssetsByCategory(allAssets, categoryKey) {
    var result = [];
    for (var i = 0; i < allAssets.length; i++) {
      if (allAssets[i].category === categoryKey) {
        result.push(allAssets[i]);
      }
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // EXPORT — Attach to window as the public API
  // ---------------------------------------------------------------------------
  window.CardRenderer = {
    renderCards: renderCards,
    createCard: createCard,
    renderFilters: renderFilters,
    getAssetsByIds: getAssetsByIds,
    getAssetsByCategory: getAssetsByCategory
  };

})();
