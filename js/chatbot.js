/**
 * chatbot.js — Global RAG chatbot powered by Cloudflare Workers AI.
 *
 * Two modes:
 *   1. Hero input on the homepage — large prominent search bar in the hero
 *   2. Floating bubble on all pages — bottom-right chat icon that opens a panel
 *
 * Both modes share the same chat engine and API connection.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------
  var API_URL = window.CHATBOT_API_URL || 'https://realprabhupada.joanmanelferrera-400.workers.dev/api/ask';

  // ---------------------------------------------------------------------------
  // Utility: Escape HTML to prevent XSS
  // ---------------------------------------------------------------------------
  function esc(str) {
    if (typeof str !== 'string') return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function formatAnswer(text) {
    if (!text) return '';
    var escaped = esc(text);
    escaped = escaped
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
    return escaped;
  }

  // ---------------------------------------------------------------------------
  // Chat State
  // ---------------------------------------------------------------------------
  var isLoading = false;
  var panelOpen = false;

  // ---------------------------------------------------------------------------
  // Build the floating bubble + chat panel (injected on every page)
  // ---------------------------------------------------------------------------
  function createFloatingChat() {
    // Don't create if it already exists
    if (document.getElementById('chatbot-fab')) return;

    var wrapper = document.createElement('div');
    wrapper.id = 'chatbot-floating';
    wrapper.innerHTML =
      '<button class="chatbot-fab" id="chatbot-fab" aria-label="Open chat assistant" title="Ask about Prabhupada\'s books">' +
        '<span class="chatbot-fab-icon" aria-hidden="true">&#x1F64F;</span>' +
        '<span class="chatbot-fab-close" aria-hidden="true">&#x2715;</span>' +
      '</button>' +
      '<div class="chatbot-panel" id="chatbot-panel" role="dialog" aria-label="Chat assistant">' +
        '<div class="chatbot-window">' +
          '<div class="chatbot-header">' +
            '<span class="chatbot-icon" aria-hidden="true">&#x1F64F;</span>' +
            '<span>Ask About Prabhupada\'s Legacy</span>' +
          '</div>' +
          '<div class="chatbot-messages" id="chatbot-messages">' +
            '<div class="chatbot-message bot">' +
              '<p>Hare Krishna! Ask me anything about Prabhupada\'s original books, the documented changes, or where to find resources.</p>' +
              '<p style="font-size:0.85em;opacity:0.7;">Puedes preguntar en espa\u00f1ol tambi\u00e9n.</p>' +
            '</div>' +
          '</div>' +
          '<div class="chatbot-input-area">' +
            '<input type="text" class="chatbot-input" id="chatbot-input" placeholder="Ask a question..." autocomplete="off" maxlength="500">' +
            '<button class="btn btn-sm chatbot-send" id="chatbot-send">Send</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(wrapper);

    // FAB toggle
    var fab = document.getElementById('chatbot-fab');
    fab.addEventListener('click', function () {
      panelOpen = !panelOpen;
      wrapper.classList.toggle('open', panelOpen);
      fab.setAttribute('aria-expanded', panelOpen);
      if (panelOpen) {
        var input = document.getElementById('chatbot-input');
        if (input) setTimeout(function () { input.focus(); }, 100);
      }
    });

    // Input handlers
    var input = document.getElementById('chatbot-input');
    var sendBtn = document.getElementById('chatbot-send');

    sendBtn.addEventListener('click', function () {
      submitQuestion(input.value);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitQuestion(input.value);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Hero input on the homepage (connects to the same floating panel)
  // ---------------------------------------------------------------------------
  function initHeroInput() {
    var heroInput = document.getElementById('hero-chat-input');
    var heroBtn = document.getElementById('hero-chat-send');
    if (!heroInput || !heroBtn) return;

    function sendFromHero() {
      var text = heroInput.value.trim();
      if (!text) return;
      heroInput.value = '';

      // Open the floating panel
      var wrapper = document.getElementById('chatbot-floating');
      var fab = document.getElementById('chatbot-fab');
      if (wrapper && !panelOpen) {
        panelOpen = true;
        wrapper.classList.add('open');
        fab.setAttribute('aria-expanded', 'true');
      }

      // Submit the question
      submitQuestion(text);
    }

    heroBtn.addEventListener('click', sendFromHero);
    heroInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendFromHero();
      }
    });

    // Suggestion chips
    var chips = document.querySelectorAll('.hero-chat-suggestion');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () {
        heroInput.value = this.getAttribute('data-q') || '';
        sendFromHero();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Also support the inline Q&A page container (backwards compat)
  // ---------------------------------------------------------------------------
  function initInlineContainer() {
    var container = document.getElementById('chatbot-container');
    if (!container) return;

    container.innerHTML =
      '<div class="chatbot-live">' +
        '<div class="chatbot-window">' +
          '<div class="chatbot-header">' +
            '<span class="chatbot-icon" aria-hidden="true">&#x1F64F;</span>' +
            '<span>Ask About Prabhupada\'s Legacy</span>' +
          '</div>' +
          '<div class="chatbot-messages" id="chatbot-messages-inline">' +
            '<div class="chatbot-message bot">' +
              '<p>Hare Krishna! Ask me anything about Prabhupada\'s original books, the documented changes, or where to find resources.</p>' +
              '<p style="font-size:0.85em;opacity:0.7;">Puedes preguntar en espa\u00f1ol tambi\u00e9n.</p>' +
            '</div>' +
          '</div>' +
          '<div class="chatbot-input-area">' +
            '<input type="text" class="chatbot-input" id="chatbot-input-inline" placeholder="Ask a question..." autocomplete="off" maxlength="500">' +
            '<button class="btn btn-sm chatbot-send" id="chatbot-send-inline">Send</button>' +
          '</div>' +
        '</div>' +
        '<p class="chatbot-disclaimer">AI answers are generated from the site\'s knowledge base. Verify important claims with the linked sources.</p>' +
      '</div>';

    var input = document.getElementById('chatbot-input-inline');
    var sendBtn = document.getElementById('chatbot-send-inline');

    sendBtn.addEventListener('click', function () {
      submitQuestionInline(input.value);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitQuestionInline(input.value);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Submit question (floating panel)
  // ---------------------------------------------------------------------------
  function submitQuestion(text) {
    if (!text || typeof text !== 'string') return;
    var trimmed = text.trim();
    if (trimmed.length === 0 || isLoading) return;

    var input = document.getElementById('chatbot-input');
    if (input) input.value = '';

    addMessage('chatbot-messages', 'user', trimmed);
    isLoading = true;
    showLoading('chatbot-messages');

    callAPI(trimmed, function (answer, followups) {
      isLoading = false;
      hideLoading('chatbot-messages');
      addMessage('chatbot-messages', 'bot', answer, followups);
    });
  }

  // ---------------------------------------------------------------------------
  // Submit question (inline Q&A container)
  // ---------------------------------------------------------------------------
  function submitQuestionInline(text) {
    if (!text || typeof text !== 'string') return;
    var trimmed = text.trim();
    if (trimmed.length === 0 || isLoading) return;

    var input = document.getElementById('chatbot-input-inline');
    if (input) input.value = '';

    addMessage('chatbot-messages-inline', 'user', trimmed);
    isLoading = true;
    showLoading('chatbot-messages-inline');

    callAPI(trimmed, function (answer, followups) {
      isLoading = false;
      hideLoading('chatbot-messages-inline');
      addMessage('chatbot-messages-inline', 'bot', answer, followups);
    });
  }

  // ---------------------------------------------------------------------------
  // API call (shared)
  // ---------------------------------------------------------------------------
  function callAPI(question, callback) {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) {
          callback('Sorry, something went wrong: ' + data.error, []);
          return;
        }
        callback(data.answer || 'No response generated.', data.followups || []);
      })
      .catch(function (err) {
        callback('Could not connect to the AI assistant. Please check your connection and try again.', []);
        console.error('Chatbot fetch error:', err);
      });
  }

  // ---------------------------------------------------------------------------
  // Add a message to a given messages container
  // ---------------------------------------------------------------------------
  function addMessage(containerId, role, text, followups) {
    var messagesEl = document.getElementById(containerId);
    if (!messagesEl) return;

    var msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-message ' + role;

    if (role === 'user') {
      msgDiv.innerHTML = '<p>' + esc(text) + '</p>';
    } else {
      msgDiv.innerHTML = '<div class="chatbot-answer">' + formatAnswer(text) + '</div>';

      if (followups && followups.length > 0) {
        var followHTML = '<div class="chatbot-followups">';
        for (var j = 0; j < followups.length; j++) {
          followHTML += '<button class="chatbot-followup-btn" data-question="' + esc(followups[j]) + '" data-target="' + containerId + '">' + esc(followups[j]) + '</button>';
        }
        followHTML += '</div>';
        msgDiv.innerHTML += followHTML;
      }
    }

    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Follow-up click handlers
    if (followups && followups.length > 0) {
      var btns = msgDiv.querySelectorAll('.chatbot-followup-btn');
      for (var k = 0; k < btns.length; k++) {
        btns[k].addEventListener('click', function () {
          var q = this.getAttribute('data-question');
          var target = this.getAttribute('data-target');
          if (!q) return;
          if (target === 'chatbot-messages-inline') {
            submitQuestionInline(q);
          } else {
            submitQuestion(q);
          }
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Loading indicator
  // ---------------------------------------------------------------------------
  function showLoading(containerId) {
    var messagesEl = document.getElementById(containerId);
    if (!messagesEl) return;

    var loader = document.createElement('div');
    loader.className = 'chatbot-message bot chatbot-loading';
    loader.setAttribute('data-loader', containerId);
    loader.innerHTML =
      '<div class="chatbot-typing">' +
        '<span></span><span></span><span></span>' +
      '</div>';

    messagesEl.appendChild(loader);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Disable the matching input
    var isInline = containerId === 'chatbot-messages-inline';
    var input = document.getElementById(isInline ? 'chatbot-input-inline' : 'chatbot-input');
    var sendBtn = document.getElementById(isInline ? 'chatbot-send-inline' : 'chatbot-send');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
  }

  function hideLoading(containerId) {
    var loader = document.querySelector('[data-loader="' + containerId + '"]');
    if (loader) loader.remove();

    var isInline = containerId === 'chatbot-messages-inline';
    var input = document.getElementById(isInline ? 'chatbot-input-inline' : 'chatbot-input');
    var sendBtn = document.getElementById(isInline ? 'chatbot-send-inline' : 'chatbot-send');
    if (input) { input.disabled = false; input.focus(); }
    if (sendBtn) sendBtn.disabled = false;
  }

  // ---------------------------------------------------------------------------
  // Initialize
  // ---------------------------------------------------------------------------
  createFloatingChat();
  initHeroInput();
  initInlineContainer();

})();
