import { env } from './env';
import siteJson from './site.json';

/**
 * Site identity. Static fields come from site.json (also read by scripts/postbuild.mjs); the origin
 * comes from `VITE_SITE_URL` so staging and production can share one build recipe.
 */
export const site = {
  ...siteJson,
  url: env.VITE_SITE_URL,
  allowIndexing: env.VITE_ALLOW_INDEXING,
} as const;

/** Absolute URL for a site path: `absoluteUrl('/about')` → `https://example.com/about`. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}
