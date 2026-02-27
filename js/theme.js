/**
 * theme.js — Dark mode toggle for Preserving Srila Prabhupada's Legacy
 *
 * Behavior:
 *   1. On load, reads localStorage('theme').
 *   2. If no saved preference, respects prefers-color-scheme.
 *   3. Toggle button switches between light/dark and persists the choice.
 *   4. The CSS already defines custom properties for .dark-mode on <body>.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var DARK_CLASS  = 'dark-mode';
  var LIGHT_CLASS = 'light-mode';
  var SUN_ICON    = '\u2600';   // sun
  var MOON_ICON   = '\uD83C\uDF19'; // crescent moon

  var toggleBtn  = document.getElementById('theme-toggle');
  var themeIcon  = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;

  /**
   * Apply the given theme to the document.
   * @param {'dark'|'light'} theme
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add(DARK_CLASS);
      document.body.classList.remove(LIGHT_CLASS);
    } else {
      document.body.classList.remove(DARK_CLASS);
      document.body.classList.add(LIGHT_CLASS);
    }
    updateIcon(theme);
  }

  /**
   * Update the toggle button icon.
   * Shows moon when in light mode (click to go dark),
   * shows sun when in dark mode (click to go light).
   */
  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'dark' ? SUN_ICON : MOON_ICON;
    if (toggleBtn) {
      toggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  /**
   * Determine the current effective theme.
   */
  function getActiveTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Initialize
  var currentTheme = getActiveTheme();
  applyTheme(currentTheme);

  // Toggle handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem(STORAGE_KEY, currentTheme);
    });
  }

  // Listen for system preference changes (only if user has no explicit choice)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  });
})();
