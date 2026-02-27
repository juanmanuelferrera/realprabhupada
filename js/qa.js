/**
 * qa.js — Q&A page logic
 *
 * Handles:
 *   1. Rendering FAQ items from window.SITE_DATA.faqItems into #faq-container
 *   2. Rendering the chatbot placeholder into #chatbot-container
 */
(function () {
  'use strict';

  var data = window.SITE_DATA;
  if (!data) return;

  // ---------------------------------------------------------------------------
  // Utility: Escape HTML to prevent XSS
  // ---------------------------------------------------------------------------
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // 1. FAQ Items
  // ---------------------------------------------------------------------------
  var faqContainer = document.getElementById('faq-container');

  if (faqContainer && data.faqItems) {
    var faqHTML = '';
    for (var i = 0; i < data.faqItems.length; i++) {
      var item = data.faqItems[i];
      faqHTML +=
        '<div class="faq-item">' +
          '<div class="faq-question">' +
            escapeHTML(item.question) +
            '<span class="faq-toggle" aria-hidden="true">&#x25BC;</span>' +
          '</div>' +
          '<div class="faq-answer">' +
            '<div class="faq-answer-inner">' +
              escapeHTML(item.answer) +
            '</div>' +
          '</div>' +
        '</div>';
    }
    faqContainer.innerHTML = faqHTML;
  }

  // ---------------------------------------------------------------------------
  // 2. Chatbot — rendered by chatbot.js (loaded separately)
  // ---------------------------------------------------------------------------

})();
