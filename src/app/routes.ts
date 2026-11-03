import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

import { DEFAULT_LOCALE, type Locale, LOCALES } from '#shared/i18n/config';

/**
 * Pages of one locale. Each route gets an id per locale because the same module is mounted once
 * per locale: `/about` (default locale, no prefix) and `/en/about`.
 *
 * New page: add it here, create src/app/routes/<name>.tsx, list its URLs in src/app/routes/prerender.ts and
 * give it a flag in src/shared/config/features.ts.
 */
function pages(locale: Locale) {
  const id = (name: string) => `${locale}.${name}`;
  return [
    index('routes/home.tsx', { id: id('home') }),
    route('about', 'routes/about.tsx', { id: id('about') }),
    route('blog', 'routes/blog.tsx', { id: id('blog') }),
    route('blog/:slug', 'routes/blog-post.tsx', { id: id('blog-post') }),
    route('contact', 'routes/contact.tsx', { id: id('contact') }),
    route('privacy', 'routes/privacy.tsx', { id: id('privacy') }),
    route('services', 'routes/services.tsx', { id: id('services') }),
  ];
}

/**
 * Route table. The default locale is served without prefix; every other locale under `/<code>`.
 * Anything else (including `/es/...` and unknown locales) falls through to the not-found route.
 */
export default [
  layout('routes/_layout.tsx', [
    ...pages(DEFAULT_LOCALE),
    ...LOCALES.filter((locale) => locale !== DEFAULT_LOCALE).flatMap((locale) =>
      prefix(locale, pages(locale)),
    ),
    route('*', 'routes/not-found.tsx'),
  ]),
] satisfies RouteConfig;
