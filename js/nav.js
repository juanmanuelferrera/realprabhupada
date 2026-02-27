/**
 * nav.js — Mobile hamburger menu and search toggle
 *
 * Handles:
 *   1. Hamburger menu open/close with proper ARIA attributes.
 *   2. Search overlay open/close.
 *   3. Closes menus on Escape key or clicking outside.
 *   4. Toggles expandable cards (myth-fact, FAQ) site-wide.
 */
(function () {
  'use strict';

  // --- Mobile navigation toggle ---
  var navToggle = document.getElementById('nav-toggle');
  var navMobile = document.getElementById('nav-mobile');

  function openNav() {
    if (!navMobile || !navToggle) return;
    navMobile.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    // Set focus to first link for accessibility
    var firstLink = navMobile.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    if (!navMobile || !navToggle) return;
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function toggleNav() {
    if (navMobile && navMobile.classList.contains('is-open')) {
      closeNav();
    } else {
      closeSearch(); // close search if open
      openNav();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }


  // --- Search overlay toggle ---
  var searchToggle  = document.getElementById('search-toggle');
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput   = document.getElementById('search-input');

  function openSearch() {
    if (!searchOverlay || !searchToggle) return;
    searchOverlay.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    if (searchInput) searchInput.focus();
  }

  function closeSearch() {
    if (!searchOverlay || !searchToggle) return;
    searchOverlay.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleSearch() {
    if (searchOverlay && searchOverlay.classList.contains('is-open')) {
      closeSearch();
    } else {
      closeNav(); // close nav if open
      openSearch();
    }
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', toggleSearch);
  }


  // --- Close on Escape key ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNav();
      closeSearch();
    }
  });


  // --- Close mobile nav when clicking outside ---
  document.addEventListener('click', function (e) {
    // Close mobile nav if click is outside nav and toggle
    if (
      navMobile && navMobile.classList.contains('is-open') &&
      !navMobile.contains(e.target) &&
      navToggle && !navToggle.contains(e.target)
    ) {
      closeNav();
    }

    // Close search if click is outside overlay and toggle
    if (
      searchOverlay && searchOverlay.classList.contains('is-open') &&
      !searchOverlay.contains(e.target) &&
      searchToggle && !searchToggle.contains(e.target)
    ) {
      closeSearch();
    }
  });


  // --- Close mobile nav on window resize past mobile breakpoint ---
  var mql = window.matchMedia('(min-width: 768px)');
  function handleResize(e) {
    if (e.matches) {
      closeNav();
    }
  }
  mql.addEventListener('change', handleResize);


  // --- Expandable cards: Myth-Fact and FAQ ---
  // Uses event delegation on the document so it works with dynamic content.
  document.addEventListener('click', function (e) {
    // Myth-Fact cards
    var mythHeader = e.target.closest('.myth-header');
    if (mythHeader) {
      var card = mythHeader.closest('.myth-fact-card');
      if (card) {
        card.classList.toggle('is-open');
      }
      return;
    }

    // FAQ items
    var faqQuestion = e.target.closest('.faq-question');
    if (faqQuestion) {
      var item = faqQuestion.closest('.faq-item');
      if (item) {
        item.classList.toggle('is-open');
      }
    }
  });
})();
