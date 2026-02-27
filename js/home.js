/**
 * home.js — Renders dynamic content on the homepage from window.SITE_DATA.
 *
 * Populates:
 *   - #stats-grid    with impact stats
 *   - #featured-grid with featured resource cards
 */
(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) {
    console.warn('home.js: window.SITE_DATA not found. Ensure data.js loads first.');
    return;
  }

  // -------------------------------------------------------------------------
  // Helper: escape HTML entities to prevent XSS
  // -------------------------------------------------------------------------
  function esc(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -------------------------------------------------------------------------
  // 1. IMPACT STATS
  // -------------------------------------------------------------------------
  function renderStats() {
    var container = document.getElementById('stats-grid');
    if (!container || !data.stats) return;

    var html = '';
    for (var i = 0; i < data.stats.length; i++) {
      var s = data.stats[i];
      html +=
        '<div class="stat-item">' +
          '<div class="stat-number">' + esc(s.number) + '<span class="stat-suffix">' + esc(s.suffix) + '</span></div>' +
          '<div class="stat-label">' + esc(s.label) + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // -------------------------------------------------------------------------
  // 2. FEATURED RESOURCE CARDS
  // -------------------------------------------------------------------------

  /**
   * Map a link type to a short button label prefix.
   */
  function linkIcon(type) {
    var map = {
      read:     'Read',
      buy:      'Buy',
      download: 'Download',
      visit:    'Visit',
      listen:   'Listen',
      watch:    'Watch'
    };
    return map[type] || 'Open';
  }

  /**
   * Return an appropriate CSS modifier for a format badge.
   */
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

  /**
   * Get the category metadata for an asset.
   */
  function categoryMeta(asset) {
    return data.categories[asset.category] || { label: asset.category, icon: '', color: '' };
  }

  function renderFeatured() {
    var container = document.getElementById('featured-grid');
    if (!container || !data.assets) return;

    var featured = [];
    for (var i = 0; i < data.assets.length; i++) {
      if (data.assets[i].featured) {
        featured.push(data.assets[i]);
      }
    }

    var html = '';
    for (var j = 0; j < featured.length; j++) {
      var asset = featured[j];
      var cat = categoryMeta(asset);

      // Category badge
      html += '<article class="card">';
      html += '<span class="card-badge">' + esc(cat.icon + ' ' + cat.label) + '</span>';

      // Title
      html += '<h3 class="card-title">';
      if (asset.links.length > 0) {
        html += '<a href="' + esc(asset.links[0].url) + '" target="_blank" rel="noopener noreferrer">' + esc(asset.title) + '</a>';
      } else {
        html += esc(asset.title);
      }
      html += '</h3>';

      // Description
      html += '<p class="card-description">' + esc(asset.description) + '</p>';

      // Format badges
      if (asset.formats && asset.formats.length > 0) {
        html += '<div class="card-meta">';
        for (var k = 0; k < asset.formats.length; k++) {
          var fmt = asset.formats[k];
          html += '<span class="format-badge ' + formatClass(fmt) + '">' + esc(fmt) + '</span> ';
        }
        html += '</div>';
      }

      // Action buttons
      if (asset.links.length > 0) {
        html += '<div class="card-actions">';
        for (var m = 0; m < asset.links.length; m++) {
          var link = asset.links[m];
          html +=
            '<a href="' + esc(link.url) + '" class="btn btn-sm" target="_blank" rel="noopener noreferrer">' +
              esc(link.label) +
            '</a>';
        }
        html += '</div>';
      }

      html += '</article>';
    }

    container.innerHTML = html;
  }

  // -------------------------------------------------------------------------
  // Initialize on DOMContentLoaded
  // -------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    renderStats();
    renderFeatured();
  }

})();
