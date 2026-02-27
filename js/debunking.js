/**
 * debunking.js — Renders all three sections of the Debunking page
 *
 * Sections:
 *   1. Myths vs. Facts — Expandable myth-fact cards
 *   2. Psychological Profile — Intro, image, numbered pattern cards, summary
 *   3. Video Evidence — Grid of video cards with timestamped quote links
 *
 * Depends on: window.SITE_DATA (loaded via data.js)
 */
(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) return;

  // Language-aware labels
  var isES = document.documentElement.lang === 'es';
  var L = {
    myth:    isES ? 'MITO'   : 'MYTH',
    fact:    isES ? 'HECHO'  : 'FACT',
    source:  isES ? 'Fuente' : 'Source',
    pattern: isES ? 'PATRÓN' : 'PATTERN',
    spanishVersion: isES ? 'Versión en español' : 'Spanish Version'
  };

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
  // 1. MYTHS VS. FACTS
  // ---------------------------------------------------------------------------
  function renderMyths() {
    var container = document.getElementById('myths-container');
    if (!container) return;

    var myths = data.debunkingMyths;
    if (!myths || myths.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">No content available.</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < myths.length; i++) {
      var item = myths[i];
      html += '<div class="myth-fact-card">';
      html +=   '<div class="myth-header">';
      html +=     '<div class="myth-icon">!</div>';
      html +=     '<div>';
      html +=       '<div class="myth-label">' + L.myth + '</div>';
      html +=       '<div class="myth-text">' + esc(item.myth) + '</div>';
      html +=     '</div>';
      html +=     '<span class="myth-toggle" aria-hidden="true">&#9660;</span>';
      html +=   '</div>';
      html +=   '<div class="fact-body">';
      html +=     '<div class="fact-inner">';
      html +=       '<div class="fact-label">' + L.fact + '</div>';
      html +=       '<div class="fact-text">' + esc(item.fact) + '</div>';
      if (item.source) {
        html +=     '<div class="fact-source">' + L.source + ': ' + esc(item.source) + '</div>';
      }
      html +=     '</div>';
      html +=   '</div>';
      html += '</div>';
    }

    container.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // 2. PSYCHOLOGICAL PROFILE
  // ---------------------------------------------------------------------------
  function renderProfile() {
    var container = document.getElementById('profile-container');
    if (!container) return;

    var profile = data.psychologicalProfile;
    if (!profile) {
      container.innerHTML = '<p class="text-muted text-center">No content available.</p>';
      return;
    }

    var html = '';

    // Intro paragraph
    if (profile.intro) {
      html += '<p class="profile-intro">' + esc(profile.intro) + '</p>';
    }

    // Featured image (prepend ../ since we are in pages/ directory)
    if (profile.image) {
      var imagePath = '../' + profile.image;
      html += '<img';
      html += ' src="' + esc(imagePath) + '"';
      html += ' alt="' + esc(profile.imageAlt || '') + '"';
      html += ' class="profile-image"';
      html += ' loading="lazy"';
      html += '>';
    }

    // Pattern cards
    if (profile.patterns && profile.patterns.length > 0) {
      for (var i = 0; i < profile.patterns.length; i++) {
        var pattern = profile.patterns[i];
        var num = pattern.id || (i + 1);

        html += '<div class="myth-fact-card">';
        html +=   '<div class="myth-header">';
        html +=     '<div class="myth-icon">' + esc(String(num)) + '</div>';
        html +=     '<div>';
        html +=       '<div class="myth-label">' + L.pattern + ' ' + esc(String(num)) + '</div>';
        html +=       '<div class="myth-text">' + esc(pattern.title) + '</div>';
        html +=     '</div>';
        html +=     '<span class="myth-toggle" aria-hidden="true">&#9660;</span>';
        html +=   '</div>';
        html +=   '<div class="fact-body">';
        html +=     '<div class="fact-inner">';
        html +=       '<div class="fact-text">' + esc(pattern.text) + '</div>';
        html +=     '</div>';
        html +=   '</div>';
        html += '</div>';
      }
    }

    // Summary paragraph
    if (profile.summary) {
      html += '<div class="profile-summary">' + esc(profile.summary) + '</div>';
    }

    container.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // 3. VIDEO EVIDENCE
  // ---------------------------------------------------------------------------
  function renderVideos() {
    var container = document.getElementById('videos-container');
    if (!container) return;

    var videos = data.videoEvidence;
    if (!videos || videos.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">No content available.</p>';
      return;
    }

    var html = '<div class="grid">';

    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];

      html += '<div class="card video-card">';
      html +=   '<span class="card-badge">Video ' + esc(String(video.id)) + '</span>';
      html +=   '<h3 class="card-title">' + esc(video.title) + '</h3>';

      // Quotes with YouTube timestamp links
      if (video.quotes && video.quotes.length > 0) {
        html += '<div class="video-quotes">';
        for (var j = 0; j < video.quotes.length; j++) {
          var quote = video.quotes[j];
          html += '<a href="' + esc(quote.url) + '"';
          html += ' class="video-quote-link"';
          html += ' target="_blank" rel="noopener noreferrer">';
          html += '&ldquo;' + esc(quote.text) + '&rdquo; &rarr;';
          html += '</a>';
        }
        html += '</div>';
      }

      // Spanish version link (if available)
      if (video.spanishUrl) {
        html += '<div class="card-actions">';
        html +=   '<a href="' + esc(video.spanishUrl) + '"';
        html +=   ' class="btn btn-sm btn-outline"';
        html +=   ' target="_blank" rel="noopener noreferrer">';
        html +=   L.spanishVersion;
        html +=   '</a>';
        html += '</div>';
      }

      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  // ---------------------------------------------------------------------------
  // INITIALIZE — Render all three sections
  // ---------------------------------------------------------------------------
  renderMyths();
  renderProfile();
  renderVideos();

})();
