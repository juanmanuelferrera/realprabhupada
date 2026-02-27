/**
 * chatbot.js — Functional RAG chatbot for the Q&A page.
 *
 * Connects to the Cloudflare Worker at /api/ask (or configured API_URL).
 * Renders a chat interface with:
 *   - Message history (bot + user)
 *   - Follow-up question buttons
 *   - Source citations
 *   - Loading state
 *   - Error handling
 *   - Cloudflare Workers AI powered
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------
  // In production, the worker runs on its own subdomain.
  // During dev, use localhost:8787.
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

  /**
   * Convert basic markdown-like formatting in bot responses to HTML.
   * Supports: **bold**, *italic*, `code`, newlines, and URLs.
   */
  function formatAnswer(text) {
    if (!text) return '';

    // Escape HTML first
    var escaped = esc(text);

    // Convert markdown-style formatting
    escaped = escaped
      // Bold: **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic: *text*
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Inline code: `text`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // URLs: make clickable
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      // Newlines to <br>
      .replace(/\n/g, '<br>');

    return escaped;
  }

  // ---------------------------------------------------------------------------
  // Chat State
  // ---------------------------------------------------------------------------
  var messages = [];
  var isLoading = false;

  // ---------------------------------------------------------------------------
  // DOM References
  // ---------------------------------------------------------------------------
  var container = document.getElementById('chatbot-container');
  if (!container) return;

  // ---------------------------------------------------------------------------
  // Render the chat interface
  // ---------------------------------------------------------------------------
  function renderChatUI() {
    container.innerHTML =
      '<div class="chatbot-live">' +
        '<div class="chatbot-window">' +
          '<div class="chatbot-header">' +
            '<span class="chatbot-icon" aria-hidden="true">&#x1F64F;</span>' +
            '<span>Ask About Prabhupada\'s Legacy</span>' +
          '</div>' +
          '<div class="chatbot-messages" id="chatbot-messages">' +
            '<div class="chatbot-message bot">' +
              '<p>Hare Krishna! I can help you find information about Prabhupada\'s original books, the documented changes, where to get original editions, and more. Ask me anything.</p>' +
              '<p style="font-size:0.85em;opacity:0.7;">Puedes preguntar en espanol tambien.</p>' +
            '</div>' +
          '</div>' +
          '<div class="chatbot-input-area" id="chatbot-input-area">' +
            '<input type="text" class="chatbot-input" id="chatbot-input" placeholder="Ask a question..." autocomplete="off" maxlength="500">' +
            '<button class="btn btn-sm chatbot-send" id="chatbot-send">Send</button>' +
          '</div>' +
        '</div>' +
        '<p class="chatbot-disclaimer">AI answers are generated from the site\'s knowledge base. Verify important claims with the linked sources.</p>' +
      '</div>';

    // Attach event listeners
    var input = document.getElementById('chatbot-input');
    var sendBtn = document.getElementById('chatbot-send');

    if (input && sendBtn) {
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
  }

  // ---------------------------------------------------------------------------
  // Submit a question
  // ---------------------------------------------------------------------------
  function submitQuestion(text) {
    if (!text || typeof text !== 'string') return;
    var trimmed = text.trim();
    if (trimmed.length === 0 || isLoading) return;

    // Clear input
    var input = document.getElementById('chatbot-input');
    if (input) input.value = '';

    // Add user message
    addMessage('user', trimmed);

    // Show loading
    isLoading = true;
    showLoading();

    // Call API
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: trimmed }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        isLoading = false;
        hideLoading();

        if (data.error) {
          addMessage('bot', 'Sorry, something went wrong: ' + data.error);
          return;
        }

        addMessage('bot', data.answer || 'No response generated.', data.sources, data.followups);
      })
      .catch(function (err) {
        isLoading = false;
        hideLoading();
        addMessage('bot', 'Could not connect to the AI assistant. Please check your connection and try again.');
        console.error('Chatbot fetch error:', err);
      });
  }

  // ---------------------------------------------------------------------------
  // Add a message to the chat
  // ---------------------------------------------------------------------------
  function addMessage(role, text, sources, followups) {
    var messagesEl = document.getElementById('chatbot-messages');
    if (!messagesEl) return;

    var msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-message ' + role;

    if (role === 'user') {
      msgDiv.innerHTML = '<p>' + esc(text) + '</p>';
    } else {
      // Bot message with formatted text
      msgDiv.innerHTML = '<div class="chatbot-answer">' + formatAnswer(text) + '</div>';

      // Sources
      if (sources && sources.length > 0) {
        var sourcesHTML = '<div class="chatbot-sources"><span class="chatbot-sources-label">Sources:</span>';
        for (var i = 0; i < sources.length; i++) {
          var s = sources[i];
          sourcesHTML += '<span class="chatbot-source-tag">' + esc(s.title || s.source) + '</span>';
        }
        sourcesHTML += '</div>';
        msgDiv.innerHTML += sourcesHTML;
      }

      // Follow-up questions
      if (followups && followups.length > 0) {
        var followHTML = '<div class="chatbot-followups">';
        for (var j = 0; j < followups.length; j++) {
          followHTML += '<button class="chatbot-followup-btn" data-question="' + esc(followups[j]) + '">' + esc(followups[j]) + '</button>';
        }
        followHTML += '</div>';
        msgDiv.innerHTML += followHTML;
      }
    }

    messagesEl.appendChild(msgDiv);

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Attach follow-up click handlers
    if (followups && followups.length > 0) {
      var btns = msgDiv.querySelectorAll('.chatbot-followup-btn');
      for (var k = 0; k < btns.length; k++) {
        btns[k].addEventListener('click', function () {
          var q = this.getAttribute('data-question');
          if (q) submitQuestion(q);
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Loading indicator
  // ---------------------------------------------------------------------------
  function showLoading() {
    var messagesEl = document.getElementById('chatbot-messages');
    if (!messagesEl) return;

    var loader = document.createElement('div');
    loader.className = 'chatbot-message bot chatbot-loading';
    loader.id = 'chatbot-loader';
    loader.innerHTML =
      '<div class="chatbot-typing">' +
        '<span></span><span></span><span></span>' +
      '</div>';

    messagesEl.appendChild(loader);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Disable input
    var input = document.getElementById('chatbot-input');
    var sendBtn = document.getElementById('chatbot-send');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
  }

  function hideLoading() {
    var loader = document.getElementById('chatbot-loader');
    if (loader) loader.remove();

    // Re-enable input
    var input = document.getElementById('chatbot-input');
    var sendBtn = document.getElementById('chatbot-send');
    if (input) {
      input.disabled = false;
      input.focus();
    }
    if (sendBtn) sendBtn.disabled = false;
  }

  // ---------------------------------------------------------------------------
  // Initialize
  // ---------------------------------------------------------------------------
  renderChatUI();

})();
