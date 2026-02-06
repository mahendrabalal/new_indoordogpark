// Patch OpenNext-generated worker to serve /data/* from ASSETS before hitting middleware
import fs from 'fs';
import path from 'path';

const workerPath = path.join(process.cwd(), '.open-next', 'worker.js');
const code = fs.readFileSync(workerPath, 'utf8');

const marker = '// Fallback for the Next default image loader.';
const snippet = `// Serve JSON data assets directly\n            if (url.pathname.startsWith("/data/")) {\n                const assetResp = await env.ASSETS?.fetch(url);\n                if (assetResp && assetResp.status !== 404) return assetResp;\n            }\n\n            `;

if (code.includes(snippet)) {
  console.log('patch-worker: already patched');
  process.exit(0);
}

if (!code.includes(marker)) {
  console.error('patch-worker: marker not found, worker format changed');
  process.exit(1);
}

const patched = code.replace(marker, `${snippet}${marker}`);
fs.writeFileSync(workerPath, patched, 'utf8');
console.log('patch-worker: patched .open-next/worker.js');
