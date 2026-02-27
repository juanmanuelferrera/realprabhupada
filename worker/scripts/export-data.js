#!/usr/bin/env node

/**
 * Export site data from data.js to JSON for the ingestion script.
 *
 * Reads the IIFE in js/data.js, executes it in a minimal browser-like
 * environment, and writes the resulting SITE_DATA to data/site-content.json.
 *
 * Usage:
 *   node scripts/export-data.js
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_JS_PATH = resolve(__dirname, '../../js/data.js');
const OUTPUT_PATH = resolve(__dirname, '../data/site-content.json');

// Create a minimal browser-like context for the IIFE
const context = {
  window: {},
  document: { createElement: () => ({ appendChild: () => {}, innerHTML: '' }) },
  console,
};

// Read and execute data.js
const dataJs = readFileSync(DATA_JS_PATH, 'utf-8');
vm.runInNewContext(dataJs, context);

const siteData = context.window.SITE_DATA;

if (!siteData) {
  console.error('ERROR: window.SITE_DATA not found after executing data.js');
  process.exit(1);
}

// Write the JSON
writeFileSync(OUTPUT_PATH, JSON.stringify(siteData, null, 2));

const stats = {
  assets: siteData.assets?.length || 0,
  debunkingMyths: siteData.debunkingMyths?.length || 0,
  psychologicalPatterns: siteData.psychologicalProfile?.patterns?.length || 0,
  videoEvidence: siteData.videoEvidence?.length || 0,
  faqItems: siteData.faqItems?.length || 0,
};

console.log('Exported site data to', OUTPUT_PATH);
console.log('  Assets:', stats.assets);
console.log('  Debunking myths:', stats.debunkingMyths);
console.log('  Psychological patterns:', stats.psychologicalPatterns);
console.log('  Video evidence:', stats.videoEvidence);
console.log('  FAQ items:', stats.faqItems);
