/**
 * es-home.js — Renders dynamic content on the Spanish homepage from window.SITE_DATA.
 *
 * Populates:
 *   - #stats-grid          with impact stats (Spanish labels)
 *   - #es-resources-grid   with Spanish-specific resource cards
 */
(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) {
    console.warn('es-home.js: window.SITE_DATA not found. Ensure data.js loads first.');
    return;
  }

  // -------------------------------------------------------------------------
  // Helper: escape HTML entities to prevent XSS
  // -------------------------------------------------------------------------
  function esc(str) {
    if (typeof str !== 'string') return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // -------------------------------------------------------------------------
  // 1. IMPACT STATS (Spanish labels)
  // -------------------------------------------------------------------------
  var spanishLabels = [
    'versos alterados',
    'de versos cambiados',
    'cambios documentados',
    'significados cambiados'
  ];

  function renderStats() {
    var container = document.getElementById('stats-grid');
    if (!container || !data.stats) return;

    var html = '';
    for (var i = 0; i < data.stats.length; i++) {
      var s = data.stats[i];
      var label = spanishLabels[i] || s.label;
      html +=
        '<div class="stat-item">' +
          '<div class="stat-number">' + esc(s.number) + '<span class="stat-suffix">' + esc(s.suffix) + '</span></div>' +
          '<div class="stat-label">' + esc(label) + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // -------------------------------------------------------------------------
  // 2. SPANISH RESOURCES
  // -------------------------------------------------------------------------

  /**
   * Find an asset by its ID.
   */
  function getAssetById(id) {
    if (!data.assets) return null;
    for (var i = 0; i < data.assets.length; i++) {
      if (data.assets[i].id === id) return data.assets[i];
    }
    return null;
  }

  /**
   * Find the video with id 19 from videoEvidence (the one with spanishUrl).
   */
  function getSpanishVideo() {
    if (!data.videoEvidence) return null;
    for (var i = 0; i < data.videoEvidence.length; i++) {
      if (data.videoEvidence[i].id === 19) return data.videoEvidence[i];
    }
    return null;
  }

  /**
   * Build a resource card for the Spanish resources section.
   * Each card has: icon, title, description, and action buttons.
   */
  function buildResourceCard(icon, title, description, links) {
    var html = '<article class="card es-resource-card">';

    // Icon
    html += '<span class="es-resource-icon" aria-hidden="true">' + icon + '</span>';

    // Title
    html += '<h3 class="card-title">' + esc(title) + '</h3>';

    // Description
    html += '<p class="card-description">' + esc(description) + '</p>';

    // Action buttons
    if (links && links.length > 0) {
      html += '<div class="card-actions">';
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        html +=
          '<a href="' + esc(link.url) + '" class="btn btn-sm" target="_blank" rel="noopener noreferrer">' +
            esc(link.label) +
          '</a>';
      }
      html += '</div>';
    }

    html += '</article>';
    return html;
  }

  function renderSpanishResources() {
    var container = document.getElementById('es-resources-grid');
    if (!container) return;

    var html = '';

    // --- Card 1: Bhagavad Gita en Espanol (asset #4) ---
    var gita = getAssetById(4);
    if (gita) {
      html += buildResourceCard(
        '\uD83D\uDCD6', // book emoji
        'Bhagavad Gita en Espa\u00f1ol',
        'Traducido del original de 1972, no de la edici\u00f3n revisada del BBT. Disponible en PDF y libro de bolsillo.',
        gita.links
      );
    }

    // --- Card 2: Palabras Robadas (from asset #2 — Spanish link) ---
    var stolenWords = getAssetById(2);
    if (stolenWords) {
      // Extract the Spanish paperback link
      var spanishLinks = [];
      for (var i = 0; i < stolenWords.links.length; i++) {
        if (stolenWords.links[i].label.indexOf('Spanish') !== -1 ||
            stolenWords.links[i].label.indexOf('Palabras') !== -1) {
          spanishLinks.push(stolenWords.links[i]);
        }
      }
      // If no specific Spanish link found, include all
      if (spanishLinks.length === 0) {
        spanishLinks = stolenWords.links;
      }
      html += buildResourceCard(
        '\uD83D\uDCDA', // books emoji
        'Palabras Robadas',
        'El crimen literario del siglo. Investigaci\u00f3n sobre los cambios no autorizados a los libros de Prabhupada. Por Jagannatha Mishra Dasa.',
        spanishLinks
      );
    }

    // --- Card 3: ArsaPrayoga.com (asset #5) ---
    var arsaPrayoga = getAssetById(5);
    if (arsaPrayoga) {
      html += buildResourceCard(
        '\uD83C\uDF10', // globe emoji
        'ArsaPrayoga.com',
        'Sitio web que documenta los cambios en los libros con art\u00edculos, serie de videos y respuestas a los defensores de las ediciones. Incluye contenido en espa\u00f1ol.',
        arsaPrayoga.links
      );
    }

    // --- Card 4: Perfil Psicológico de los editores ---
    var video19 = getSpanishVideo();
    if (video19 && video19.spanishUrl) {
      html += buildResourceCard(
        '\uD83E\uDDE0', // brain emoji
        'Perfil Psicol\u00f3gico de los editores',
        'An\u00e1lisis de los patrones de comportamiento de los editores y defensores de la revisi\u00f3n del Bhagavad Gita, basado en sus propios argumentos en 19 videos.',
        [
          { label: 'Ver en Espa\u00f1ol', url: video19.spanishUrl },
          { label: 'Original (YouTube)', url: video19.quotes[0].url }
        ]
      );
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
    renderSpanishResources();
  }

})();
