/**
 * Runs after `react-router build` (see the `build` script). Writes robots.txt and sitemap.xml into
 * build/client from the prerendered HTML, and fails the build when the SEO tags are inconsistent.
 *
 * Origin and indexing come from the same validated env as the app (src/config/env.schema.ts,
 * loaded with Node type stripping), so the sitemap can never disagree with the canonical URLs.
 */
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

import { parseEnv } from '../src/config/env.schema.ts';
import { extractPageLinks, planSitemap, renderRobots, renderSitemap, routeFromFile } from './seo/sitemap.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const CLIENT = join(root, 'build/client');

/** HTML files that are not pages of their own. */
const SKIP = new Set(['__spa-fallback.html']);

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') && !SKIP.has(entry.name) ? [full] : [];
  });
}

const env = parseEnv(
  loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', root, 'VITE_'),
);
const origin = env.VITE_SITE_URL;

writeFileSync(join(CLIENT, 'robots.txt'), renderRobots({ origin, allowIndexing: env.VITE_ALLOW_INDEXING }));

if (!env.VITE_ALLOW_INDEXING) {
  rmSync(join(CLIENT, 'sitemap.xml'), { force: true });
  console.log(
    'postbuild: indexing disabled (VITE_ALLOW_INDEXING=false): robots.txt disallows all, no sitemap',
  );
} else {
  const pages = htmlFiles(CLIENT).map((file) => {
    const rel = relative(CLIENT, file);
    return { file: rel, route: routeFromFile(rel), links: extractPageLinks(readFileSync(file, 'utf8')) };
  });
  const entries = planSitemap({ pages, origin });
  writeFileSync(join(CLIENT, 'sitemap.xml'), renderSitemap(entries));
  console.log(
    `postbuild: sitemap.xml with ${entries.length} URLs (${pages.length - entries.length} noindex pages skipped)`,
  );
}
