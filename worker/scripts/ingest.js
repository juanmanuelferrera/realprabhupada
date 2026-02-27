#!/usr/bin/env node

/**
 * RealPrabhupada Ingestion Script
 *
 * Reads site-content.json (exported from data.js), chunks it into
 * ~500-token passages, and optionally embeds + uploads to Cloudflare Vectorize.
 *
 * Usage:
 *   node scripts/export-data.js           # First: export data.js to JSON
 *   node scripts/ingest.js                # Generate chunks.json only
 *   node scripts/ingest.js --upload       # Generate + embed + upload to Vectorize
 *
 * For --upload, set these environment variables:
 *   CLOUDFLARE_ACCOUNT_ID   - Your Cloudflare account ID
 *   CLOUDFLARE_API_TOKEN    - API token with Workers AI and Vectorize permissions
 *
 * Prerequisites (run once):
 *   npx wrangler vectorize create realprabhupada-index --dimensions=768 --metric=cosine
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Paths ---
const DATA_PATH = resolve(__dirname, '../data/site-content.json');
const OUTPUT_PATH = resolve(__dirname, '../data/chunks.json');

// --- Config ---
const TARGET_TOKENS = 500;
const OVERLAP_TOKENS = 50;
const VECTORIZE_BATCH_SIZE = 40;
const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';

// ---------------------------------------------------------------------------
// Token estimation
// ---------------------------------------------------------------------------

function estimateTokens(text) {
  if (!text) return 0;
  const words = text.split(/\s+/).filter(Boolean);
  return Math.ceil(words.length * 1.33);
}

function splitIntoChunks(text, targetTokens = TARGET_TOKENS, overlapTokens = OVERLAP_TOKENS) {
  if (!text || estimateTokens(text) <= targetTokens) {
    return [text];
  }

  const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
  const chunks = [];
  let current = '';
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);

    if (currentTokens + sentenceTokens > targetTokens && current.length > 0) {
      chunks.push(current.trim());

      const words = current.trim().split(/\s+/);
      const overlapWords = Math.ceil(overlapTokens / 1.33);
      const overlapText = words.slice(-overlapWords).join(' ');
      current = overlapText + ' ' + sentence;
      currentTokens = estimateTokens(current);
    } else {
      current += sentence;
      currentTokens += sentenceTokens;
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Chunk builders
// ---------------------------------------------------------------------------

/**
 * Build chunks from assets array.
 */
function chunkAssets(assets) {
  const chunks = [];

  for (const asset of assets) {
    const parts = [];
    parts.push(`Resource: ${asset.title}`);
    parts.push(`Category: ${asset.category}`);
    parts.push(`Description: ${asset.description}`);

    if (asset.links && asset.links.length > 0) {
      const linkStrs = asset.links.map(l => `${l.label}: ${l.url}`);
      parts.push(`Available at: ${linkStrs.join(' | ')}`);
    }

    if (asset.formats && asset.formats.length > 0) {
      parts.push(`Formats: ${asset.formats.join(', ')}`);
    }

    if (asset.tags && asset.tags.length > 0) {
      parts.push(`Tags: ${asset.tags.join(', ')}`);
    }

    const text = parts.join('\n');

    chunks.push({
      id: `asset-${asset.id}`,
      text,
      metadata: {
        source: 'assets',
        type: asset.category,
        title: asset.title,
        id: String(asset.id),
        text,
      },
    });
  }

  return chunks;
}

/**
 * Build chunks from debunking myths.
 */
function chunkMyths(myths) {
  const chunks = [];

  for (let i = 0; i < myths.length; i++) {
    const myth = myths[i];
    const text = [
      `MYTH: "${myth.myth}"`,
      `FACT: ${myth.fact}`,
      `Source: ${myth.source}`,
    ].join('\n');

    chunks.push({
      id: `myth-${i + 1}`,
      text,
      metadata: {
        source: 'debunking',
        type: 'myth-fact',
        title: myth.myth,
        text,
      },
    });
  }

  return chunks;
}

/**
 * Build chunks from psychological profile.
 */
function chunkProfile(profile) {
  const chunks = [];

  // Intro + summary as one chunk
  const introText = [
    `Psychological Profile of the Editors and Defenders of the Bhagavad Gita Revision`,
    `Introduction: ${profile.intro}`,
    `Summary: ${profile.summary}`,
  ].join('\n\n');

  const introChunks = splitIntoChunks(introText);
  for (let i = 0; i < introChunks.length; i++) {
    chunks.push({
      id: introChunks.length === 1 ? 'profile-intro' : `profile-intro-${i + 1}`,
      text: introChunks[i],
      metadata: {
        source: 'psychological-profile',
        type: 'overview',
        title: 'Psychological Profile Overview',
        text: introChunks[i],
      },
    });
  }

  // Each pattern as a separate chunk (may split long ones)
  for (const pattern of profile.patterns) {
    const patternText = [
      `Behavioral Pattern ${pattern.id}: ${pattern.title}`,
      pattern.text,
    ].join('\n\n');

    const patternChunks = splitIntoChunks(patternText);

    for (let i = 0; i < patternChunks.length; i++) {
      const chunkId = patternChunks.length === 1
        ? `profile-pattern-${pattern.id}`
        : `profile-pattern-${pattern.id}-${i + 1}`;

      chunks.push({
        id: chunkId,
        text: patternChunks[i],
        metadata: {
          source: 'psychological-profile',
          type: 'pattern',
          title: pattern.title,
          text: patternChunks[i],
        },
      });
    }
  }

  return chunks;
}

/**
 * Build chunks from video evidence.
 */
function chunkVideos(videos) {
  const chunks = [];

  for (const video of videos) {
    const parts = [];
    parts.push(`Video ${video.id}: "${video.title}"`);

    if (video.quotes && video.quotes.length > 0) {
      for (const quote of video.quotes) {
        parts.push(`Quote: "${quote.text}" — ${quote.url}`);
      }
    }

    if (video.spanishUrl) {
      parts.push(`Spanish version: ${video.spanishUrl}`);
    }

    const text = parts.join('\n');

    chunks.push({
      id: `video-${video.id}`,
      text,
      metadata: {
        source: 'video-evidence',
        type: 'video',
        title: video.title,
        text,
      },
    });
  }

  return chunks;
}

/**
 * Build chunks from FAQ items.
 */
function chunkFAQ(faqItems) {
  const chunks = [];

  for (let i = 0; i < faqItems.length; i++) {
    const faq = faqItems[i];
    const text = [
      `Question: ${faq.question}`,
      `Answer: ${faq.answer}`,
    ].join('\n');

    chunks.push({
      id: `faq-${i + 1}`,
      text,
      metadata: {
        source: 'faq',
        type: 'faq',
        title: faq.question,
        text,
      },
    });
  }

  return chunks;
}

/**
 * Build chunks from solution statement and stats.
 */
function chunkSolutionAndStats(solution, stats) {
  const chunks = [];

  // Solution
  if (solution) {
    const solText = [
      `The Solution to the Controversy About Srila Prabhupada's Books:`,
      ...solution.points.map((p, i) => `${i + 1}. ${p}`),
      solution.conclusion,
    ].join('\n');

    chunks.push({
      id: 'solution',
      text: solText,
      metadata: {
        source: 'solution',
        type: 'solution',
        title: 'The Solution',
        text: solText,
      },
    });
  }

  // Stats
  if (stats && stats.length > 0) {
    const statsText = [
      'Impact Statistics — Documented alterations to Bhagavad Gita As It Is:',
      ...stats.map(s => `${s.number}${s.suffix} ${s.label}`),
    ].join('\n');

    chunks.push({
      id: 'stats',
      text: statsText,
      metadata: {
        source: 'stats',
        type: 'stats',
        title: 'Impact Statistics',
        text: statsText,
      },
    });
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Upload to Vectorize via Cloudflare API
// ---------------------------------------------------------------------------

async function embedTexts(texts, accountId, apiToken) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${EMBEDDING_MODEL}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: texts }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${errText}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(`Embedding API returned failure: ${JSON.stringify(result.errors)}`);
  }

  return result.result.data;
}

async function uploadVectors(vectors, accountId, apiToken, indexName = 'realprabhupada-index') {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${indexName}/upsert`;

  const ndjson = vectors.map((v) => JSON.stringify(v)).join('\n');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/x-ndjson',
    },
    body: ndjson,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Vectorize upsert error (${response.status}): ${errText}`);
  }

  return await response.json();
}

async function embedAndUpload(chunks) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.error('ERROR: Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables.');
    process.exit(1);
  }

  const total = chunks.length;
  let uploaded = 0;

  console.log(`\nEmbedding and uploading ${total} chunks in batches of ${VECTORIZE_BATCH_SIZE}...\n`);

  for (let i = 0; i < total; i += VECTORIZE_BATCH_SIZE) {
    const batch = chunks.slice(i, i + VECTORIZE_BATCH_SIZE);
    const texts = batch.map((c) => c.text);

    const embeddings = await embedTexts(texts, accountId, apiToken);

    const vectors = batch.map((chunk, idx) => ({
      id: chunk.id,
      values: embeddings[idx],
      metadata: chunk.metadata,
    }));

    await uploadVectors(vectors, accountId, apiToken);

    uploaded += batch.length;
    const pct = Math.round((uploaded / total) * 100);
    const bar = '='.repeat(Math.floor(pct / 2)).padEnd(50);
    process.stdout.write(`\r  [${bar}] ${pct}% (${uploaded}/${total})`);

    if (i + VECTORIZE_BATCH_SIZE < total) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log('\n\nUpload complete.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const doUpload = process.argv.includes('--upload');

  console.log('RealPrabhupada Ingestion Script');
  console.log('===============================\n');

  // --- Load data ---
  console.log('Loading site-content.json...');

  let siteData;
  try {
    siteData = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  } catch (err) {
    console.error('ERROR: Could not read', DATA_PATH);
    console.error('Run "npm run export-data" first to generate it from data.js');
    process.exit(1);
  }

  console.log(`  Assets: ${siteData.assets?.length || 0}`);
  console.log(`  Myths: ${siteData.debunkingMyths?.length || 0}`);
  console.log(`  Profile patterns: ${siteData.psychologicalProfile?.patterns?.length || 0}`);
  console.log(`  Videos: ${siteData.videoEvidence?.length || 0}`);
  console.log(`  FAQ: ${siteData.faqItems?.length || 0}`);

  // --- Build chunks ---
  console.log('\nChunking data...');

  const assetChunks = chunkAssets(siteData.assets || []);
  console.log(`  assets     -> ${assetChunks.length} chunks`);

  const mythChunks = chunkMyths(siteData.debunkingMyths || []);
  console.log(`  myths      -> ${mythChunks.length} chunks`);

  const profileChunks = siteData.psychologicalProfile
    ? chunkProfile(siteData.psychologicalProfile)
    : [];
  console.log(`  profile    -> ${profileChunks.length} chunks`);

  const videoChunks = chunkVideos(siteData.videoEvidence || []);
  console.log(`  videos     -> ${videoChunks.length} chunks`);

  const faqChunks = chunkFAQ(siteData.faqItems || []);
  console.log(`  faq        -> ${faqChunks.length} chunks`);

  const extraChunks = chunkSolutionAndStats(siteData.solution, siteData.stats);
  console.log(`  solution+stats -> ${extraChunks.length} chunks`);

  const allChunks = [
    ...assetChunks,
    ...mythChunks,
    ...profileChunks,
    ...videoChunks,
    ...faqChunks,
    ...extraChunks,
  ];

  // --- Stats ---
  const tokenCounts = allChunks.map((c) => estimateTokens(c.text));
  const totalTokens = tokenCounts.reduce((a, b) => a + b, 0);
  const avgTokens = Math.round(totalTokens / allChunks.length);
  const minTokens = Math.min(...tokenCounts);
  const maxTokens = Math.max(...tokenCounts);

  const bySource = {};
  for (const chunk of allChunks) {
    const src = chunk.metadata.source;
    bySource[src] = (bySource[src] || 0) + 1;
  }

  console.log('\n--- Summary ---');
  console.log(`Total chunks:       ${allChunks.length}`);
  console.log(`Total tokens (est): ${totalTokens.toLocaleString()}`);
  console.log(`Avg tokens/chunk:   ${avgTokens}`);
  console.log(`Min tokens/chunk:   ${minTokens}`);
  console.log(`Max tokens/chunk:   ${maxTokens}`);
  console.log(`Chunks by source:`);
  for (const [src, count] of Object.entries(bySource)) {
    console.log(`  ${src.padEnd(24)} ${count}`);
  }

  // --- Write chunks.json ---
  writeFileSync(OUTPUT_PATH, JSON.stringify(allChunks, null, 2));
  console.log(`\nWrote ${allChunks.length} chunks to ${OUTPUT_PATH}`);

  // --- Upload if requested ---
  if (doUpload) {
    embedAndUpload(allChunks).catch((err) => {
      console.error('\nUpload failed:', err.message);
      process.exit(1);
    });
  } else {
    console.log('\nTo embed and upload to Vectorize, run:');
    console.log('  CLOUDFLARE_ACCOUNT_ID=xxx CLOUDFLARE_API_TOKEN=xxx npm run ingest:upload');
    console.log('\nPrerequisite (run once):');
    console.log('  npx wrangler vectorize create realprabhupada-index --dimensions=768 --metric=cosine');
  }
}

main();
