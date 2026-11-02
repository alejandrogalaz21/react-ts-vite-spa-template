import { getPostSlugs } from '../actions/posts';
import { LOCALES, localizePath } from '../i18n/config';

/**
 * Locale-neutral paths of every static page. Each one is prerendered once per locale.
 * Relative imports on purpose: this module is loaded by react-router.config.ts at build time.
 */
const STATIC_PATHS = ['/', '/about', '/blog', '/contact', '/privacy'];

/**
 * Every URL written to `build/client/` as HTML, plus `/404` (served by the host for unknown paths).
 * Dynamic routes add their params here: the blog adds one URL per post and locale.
 */
export function getPrerenderPaths(): string[] {
  const paths = LOCALES.flatMap((locale) => [
    ...STATIC_PATHS.map((path) => localizePath(path, locale)),
    ...getPostSlugs(locale).map((slug) => localizePath(`/blog/${slug}`, locale)),
  ]);
  return [...paths, '/404'];
}
