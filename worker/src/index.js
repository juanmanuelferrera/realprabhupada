/**
 * RealPrabhupada RAG Worker
 *
 * Cloudflare Worker that handles RAG queries about Srila Prabhupada's
 * original books and the documented changes to them.
 *
 * Routes:
 *   POST /api/ask   - Main RAG query endpoint
 *   OPTIONS /api/ask - CORS preflight
 *   *               - 404
 */

const ALLOWED_ORIGINS = [
  'https://realprabhupada.pages.dev',
];

const SYSTEM_PROMPT = `You are a knowledgeable assistant for "Preserving Srila Prabhupada's Legacy" — a central hub for protecting and distributing the original, pre-1978 editions of Srila Prabhupada's transcendental literature.

CRITICAL CONTEXT:
- The 1972 Macmillan edition of Bhagavad Gita As It Is was personally supervised and approved by Srila Prabhupada during his lifetime.
- After his departure in 1977, the BBT published a revised edition in 1983 with over 5,000 changes.
- 541 out of 700 verses (77%) were altered. 496 of 625 purports and 483 of 653 translations were modified.
- No documented evidence exists of Prabhupada authorizing this posthumous revision.
- Prabhupada gave explicit instructions not to change his books ("the next printing should be again to the original way").
- This website exists to document these changes, make original editions accessible, and present the evidence.

You MUST answer the user's question using the context passages provided below. The passages contain real data from the site's knowledge base — including resource listings, documented myths vs. facts, behavioral analysis of the editors and defenders of the revision, video evidence with timestamps, and frequently asked questions.

RULES:
1. USE the provided context passages to answer. They contain information about resources, book changes, editorial analysis, video evidence, and FAQs.
2. When recommending resources, include the specific URLs from the context so users can access them directly.
3. When citing video evidence, include the YouTube URL with timestamp so users can verify the claims themselves.
4. When discussing the psychological profile of the editors, present the behavioral patterns as observations drawn from the editors' own statements in the cited videos. These are not clinical diagnoses but verifiable behavioral patterns.
5. NEVER describe the 1983 changes as "improvements", "corrections", or "enhancements." They are unauthorized posthumous alterations to the author's approved text.
6. The 1972 edition is the authorized baseline. The website's position is that original, pre-1978 editions must be preserved and distributed without changes.
7. Be factual and evidence-based. Present documented facts without attacking individuals personally. Let the evidence speak.
8. If the user asks where to read, download, or buy original books, provide specific resource links from the context.
9. If NONE of the context passages are relevant to the question, say "I don't have specific information about that in my knowledge base. Try browsing the site's resources or asking a different question."
10. Give complete, detailed answers. Do not cut off mid-sentence.
11. You may answer in Spanish if the user writes in Spanish. Match the user's language.
12. The "solution" to the controversy is simple: (a) the BBT's error is presenting their new edition as if it were the original, (b) the 1972 edition must be printed without changes forever, (c) later editions must be clearly differentiated with the editor's name on the cover, (d) people should be able to buy whichever version they prefer.
13. At the END of your answer, suggest exactly 3 follow-up questions the user might want to ask next. Each must be on its own line wrapped in tags like this:
[FOLLOWUP]What resources are available to verify the changes?[/FOLLOWUP]
The follow-up questions should be specific, interesting, and directly related to the data available. Do NOT number them. Write them in the same language as your answer.`;

/**
 * Check whether the request origin is allowed for CORS.
 */
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.pages\.dev$/.test(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

/**
 * Build CORS headers for the given origin.
 */
function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

/**
 * Return a JSON response with CORS headers.
 */
function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

/**
 * Extract source metadata from Vectorize matches for the response.
 */
function extractSources(matches) {
  const seen = new Set();
  const sources = [];

  for (const match of matches) {
    const meta = match.metadata || {};
    const key = meta.source + ':' + (meta.id || meta.title || 'unknown');

    if (seen.has(key)) continue;
    seen.add(key);

    sources.push({
      source: meta.source || 'unknown',
      title: meta.title || '',
      text_snippet: (meta.text || '').slice(0, 200),
    });
  }

  return sources;
}

/**
 * Build the user prompt with retrieved context chunks.
 */
function buildPrompt(question, matches) {
  let contextBlock = '';

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const meta = m.metadata || {};
    contextBlock += `--- Passage ${i + 1} (source: ${meta.source || '?'}, type: ${meta.type || '?'}) ---\n`;
    contextBlock += (meta.text || '[no text]') + '\n\n';
  }

  return `Context passages retrieved from the knowledge base:

${contextBlock}
Question: ${question}

Answer based ONLY on the context above.`;
}

/**
 * Handle POST /api/ask
 */
async function handleAsk(request, env, origin) {
  // --- Parse body ---
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400, origin);
  }

  // --- Validate question ---
  const { question } = body;

  if (question === undefined || question === null) {
    return jsonResponse({ error: 'Missing required field: question.' }, 400, origin);
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return jsonResponse({ error: 'Question must be a non-empty string.' }, 400, origin);
  }

  if (question.length > 500) {
    return jsonResponse({ error: 'Question must be 500 characters or fewer.' }, 400, origin);
  }

  const trimmedQuestion = question.trim();

  try {
    // --- Step 1: Embed the question ---
    const embeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [trimmedQuestion],
    });

    const queryVector = embeddingResponse.data[0];

    // --- Step 2: Search Vectorize for top matches ---
    const vectorResults = await env.VECTORIZE.query(queryVector, {
      topK: 8,
      returnMetadata: 'all',
    });

    let matches = (vectorResults.matches || []).slice(0, 8);

    if (matches.length === 0) {
      return jsonResponse(
        {
          answer: "I don't have specific information about that in my knowledge base. Try browsing the site's resources or asking a different question.",
          sources: [],
        },
        200,
        origin
      );
    }

    // --- Step 3: Build prompt with context ---
    const userPrompt = buildPrompt(trimmedQuestion, matches);

    // --- Step 4: Generate answer via Cloudflare Workers AI ---
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-70b-instruct', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.3,
    });

    const rawAnswer = aiResponse.response || 'No response generated.';

    // --- Step 5: Extract follow-up questions from response ---
    const followups = [];
    const cleanAnswer = rawAnswer.replace(/\[FOLLOWUP\](.*?)\[\/FOLLOWUP\]/gs, (_, q) => {
      followups.push(q.trim());
      return '';
    }).trim();

    // --- Step 6: Return structured response ---
    const sources = extractSources(matches);

    return jsonResponse({ answer: cleanAnswer, sources, followups }, 200, origin);
  } catch (err) {
    console.error('RAG pipeline error:', err);
    return jsonResponse(
      {
        error: 'An internal error occurred while processing your question. Please try again.',
      },
      500,
      origin
    );
  }
}

/**
 * Worker fetch handler.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // --- CORS preflight ---
    if (request.method === 'OPTIONS' && url.pathname === '/api/ask') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // --- POST /api/ask ---
    if (request.method === 'POST' && url.pathname === '/api/ask') {
      return handleAsk(request, env, origin);
    }

    // --- Everything else: 404 ---
    return jsonResponse({ error: 'Not found.' }, 404, origin);
  },
};
