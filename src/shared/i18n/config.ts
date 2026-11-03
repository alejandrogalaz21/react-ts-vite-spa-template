/**
 * Single source of truth for locales. Routing, SEO (hreflang), prerender and the sitemap all read
 * from here: adding a locale means adding it to LOCALES and creating its dictionary and content.
 */
export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** Served without a URL prefix (`/about`); every other locale is prefixed (`/en/about`). */
export const DEFAULT_LOCALE: Locale = 'es';

/** BCP 47 tags for `og:locale` and `Intl` formatting. */
export const LOCALE_TAGS: Record<Locale, string> = { es: 'es_MX', en: 'en_US' };

/** Type guard for values coming from the URL. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Locale of an arbitrary pathname, falling back to the default. */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return isLocale(first) && first !== DEFAULT_LOCALE ? first : DEFAULT_LOCALE;
}

/**
 * Prefixes a locale-neutral path: `localizePath('/about', 'en')` → `/en/about`,
 * `localizePath('/', 'en')` → `/en`, `localizePath('/about', 'es')` → `/about`.
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  if (locale === DEFAULT_LOCALE) return clean || '/';
  return `/${locale}${clean}`;
}

/** Inverse of localizePath: removes the locale prefix, `/en/about` → `/about`. */
export function stripLocale(pathname: string): string {
  const locale = localeFromPathname(pathname);
  if (locale === DEFAULT_LOCALE) return pathname || '/';
  return pathname.slice(locale.length + 1) || '/';
}
