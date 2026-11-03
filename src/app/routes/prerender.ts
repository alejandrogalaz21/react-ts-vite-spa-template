// react-router.config.ts loads this module before Vite builds the app, so it cannot pull React views
// or CSS through the blog's index.ts: import the data module directly. Keep this chain free of JSX.
// eslint-disable-next-line no-restricted-imports
import { getPostSlugs } from '#features/blog/api/posts';
import { isPageEnabled } from '#shared/feature-flags/flags';
import { LOCALES, localizePath } from '#shared/i18n/config';

/**
 * Locale-neutral paths of every static page. Each one is prerendered once per locale, even when its
 * flag is off: the URL then serves the "coming soon" view (noindex) instead of a 404.
 */
const STATIC_PATHS = ['/', '/about', '/blog', '/contact', '/privacy', '/services'];

/**
 * Every URL written to `build/client/` as HTML, plus `/404` (served by the host for unknown paths).
 * Dynamic routes add their params here: the blog adds one URL per post and locale, only while
 * `pages.blog` is on.
 */
export function getPrerenderPaths(): string[] {
  const paths = LOCALES.flatMap((locale) => [
    ...STATIC_PATHS.map((path) => localizePath(path, locale)),
    ...(isPageEnabled('blog') ? getPostSlugs(locale) : []).map((slug) =>
      localizePath(`/blog/${slug}`, locale),
    ),
  ]);
  return [...paths, '/404'];
}
