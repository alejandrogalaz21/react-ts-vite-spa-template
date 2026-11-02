/**
 * Local static server for build/client, used by `npm run preview` and the e2e suite. It mirrors
 * the hosting contract documented in docs/deploy.md:
 *
 *   /about        → build/client/about/index.html   (clean URLs)
 *   /about/       → 301 to /about                   (one canonical form)
 *   unknown path  → build/client/404/index.html with status 404
 *
 * Zero dependencies on purpose. Not for production.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../build/client', import.meta.url));
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.data': 'text/x-script',
};

const isFile = (path) => existsSync(path) && statSync(path).isFile();

function send(res, status, file) {
  res.writeHead(status, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': file.includes(`${join('assets', '')}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(301, { Location: pathname.replace(/\/+$/, '') + url.search });
    res.end();
    return;
  }

  const safe = normalize(join(ROOT, pathname));
  if (!safe.startsWith(ROOT)) {
    res.writeHead(400);
    res.end();
    return;
  }

  const candidates = [safe, join(safe, 'index.html')];
  const file = candidates.find(isFile);
  if (file) return send(res, 200, file);
  return send(res, 404, join(ROOT, '404', 'index.html'));
}).listen(PORT, () => console.log(`Serving build/client on http://localhost:${PORT}`));
