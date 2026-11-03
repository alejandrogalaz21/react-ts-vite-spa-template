import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { type Locale, localeFromPathname, localizePath } from './config';
import { en } from './dictionaries/en';
import { type Dictionary, es } from './dictionaries/es';

export * from './config';
export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

/** Dictionary for a locale. Use in `meta`/`loader` functions, where hooks are not available. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Texts of one feature, one entry per locale. Adding a locale to `LOCALES` makes every feature that
 * lacks it fail to compile.
 */
export type LocaleTexts<T> = Readonly<Record<Locale, T>>;

/**
 * Picks a feature's texts for the active locale. Features wrap it in their own hook
 * (`useBlogText()`), so shared/ never needs to know which features exist.
 */
export function useLocaleText<T>(texts: LocaleTexts<T>): T {
  const { pathname } = useLocation();
  return texts[localeFromPathname(pathname)];
}

/** Value returned by {@link useI18n}. */
export interface I18n {
  locale: Locale;
  t: Dictionary;
  /** Localizes a locale-neutral path for the active locale: `href('/about')`. */
  href: (path: string) => string;
}

/**
 * Active locale, its dictionary and a path helper. The locale comes from the URL (`/en/...`), so
 * there is no provider and the prerendered HTML and the hydrated app always agree.
 */
export function useI18n(): I18n {
  const { pathname } = useLocation();
  const locale = localeFromPathname(pathname);
  return useMemo(
    () => ({ locale, t: DICTIONARIES[locale], href: (path: string) => localizePath(path, locale) }),
    [locale],
  );
}
