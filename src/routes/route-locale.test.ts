import { describe, expect, it } from 'vitest';

import { getRouteLocale } from './route-locale';

const req = (path: string) => new Request(`https://example.com${path}`);

describe('getRouteLocale', () => {
  it('reads the locale from document requests', () => {
    expect(getRouteLocale(req('/'))).toBe('es');
    expect(getRouteLocale(req('/en'))).toBe('en');
    expect(getRouteLocale(req('/en/about'))).toBe('en');
  });

  it('ignores the .data suffix of data requests', () => {
    expect(getRouteLocale(req('/en.data'))).toBe('en');
    expect(getRouteLocale(req('/_.data'))).toBe('es');
    expect(getRouteLocale(req('/en/blog.data'))).toBe('en');
  });
});
