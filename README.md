# Real Prabhupada

Sitio estático bilingüe (inglés/español), «Preserving Srila Prabhupada's Legacy», con páginas de libros, audios, documentos, preguntas y respuestas, comunidad, herramientas y refutaciones, más un chatbot que consulta un backend RAG en un Worker de Cloudflare.

## Estructura

- `index.html`, `pages/` — la web en inglés (`audio`, `books`, `community`, `debunking`, `documents`, `qa`, `tools`).
- `es/` — versión en español (`index.html` y `pages/`).
- `js/` — datos y lógica del cliente (`data.js`, `es-data.js`, `cards.js`, `chatbot.js`, `search.js` con lunr, `qa.js`, `debunking.js`, `nav.js`, `theme.js`…).
- `css/styles.css`, `assets/images/` — estilos e imágenes.
- `models/Xenova/` — modelos locales; excluidos del despliegue de Pages (`.cfignore`).
- `worker/` — Worker `realprabhupada` (`src/index.js`, `wrangler.toml`) con el backend RAG sobre Cloudflare Workers AI; `data/` guarda `chunks.json` y `site-content.json`, y `scripts/export-data.js` los exporta. También excluido de Pages.

## Uso

La web es HTML/JS sin paso de compilación; se publica en Cloudflare Pages (`.cfignore` deja fuera `models/`, `worker/` y `lancedb/`).

```bash
cd worker
npm install
npm run dev            # wrangler dev
npm run deploy         # wrangler deploy
npm run export-data    # node scripts/export-data.js
```

`package.json` también declara `ingest` y `ingest:upload`, pero `scripts/ingest.js` no está en el repo.

## Estado

Cuatro commits del 27-feb-2026: sitio inicial, cambio del RAG a Workers AI, `.cfignore` y soporte bilingüe con enlaces a documentos.

## Repositorio

`https://github.com/juanmanuelferrera/realprabhupada.git` (remoto `origin`).
