import { describe, expect, it } from 'vitest';

import { isLocale, localeFromPathname, localizePath, stripLocale } from './config';

describe('locale routing helpers', () => {
  it('prefixes only non-default locales', () => {
    expect(localizePath('/', 'es')).toBe('/');
    expect(localizePath('/about', 'es')).toBe('/about');
    expect(localizePath('/', 'en')).toBe('/en');
    expect(localizePath('/about/', 'en')).toBe('/en/about');
  });

  it('reads the locale from a pathname', () => {
    expect(localeFromPathname('/')).toBe('es');
    expect(localeFromPathname('/en/blog')).toBe('en');
    expect(localeFromPathname('/english')).toBe('es');
  });

  it('strips the locale prefix', () => {
    expect(stripLocale('/en/blog/x')).toBe('/blog/x');
    expect(stripLocale('/en')).toBe('/');
    expect(stripLocale('/blog')).toBe('/blog');
  });

  it('guards locale values', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
