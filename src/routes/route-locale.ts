import { type Locale, localeFromPathname } from '~/i18n/config';

/**
 * Locale of a route, read from the request URL (`/en/about` → `en`). src/routes.ts mounts every
 * page once per locale, so the URL is always a known locale here; unknown prefixes never reach a
 * page (they fall through to the not-found route).
 *
 * Loaders also run for data requests, whose URL carries a `.data` suffix: `/en` is requested as
 * `/en.data`. The suffix is removed first, or the English home would resolve to the default locale.
 */
export function getRouteLocale(request: Request): Locale {
  const pathname = new URL(request.url).pathname.replace(/\.data$/, '');
  return localeFromPathname(pathname);
}
