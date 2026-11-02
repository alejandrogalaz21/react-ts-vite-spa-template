import { describe, expect, it } from 'vitest';

import { buildMeta } from './meta';

const page = { title: 'T', description: 'D', path: '/about', locale: 'en' as const };

describe('buildMeta', () => {
  it('emits canonical and reciprocal hreflang alternates with x-default', () => {
    const tags = buildMeta(page);
    expect(tags).toContainEqual({ tagName: 'link', rel: 'canonical', href: 'https://example.com/en/about' });
    expect(tags).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'es',
      href: 'https://example.com/about',
    });
    expect(tags).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: 'https://example.com/en/about',
    });
    expect(tags).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: 'https://example.com/about',
    });
  });

  it('sets Open Graph with an absolute image and the og:locale', () => {
    const tags = buildMeta(page);
    expect(tags).toContainEqual({ property: 'og:image', content: 'https://example.com/og-default.png' });
    expect(tags).toContainEqual({ property: 'og:locale', content: 'en_US' });
  });

  it('noindex pages get no canonical or alternates', () => {
    const tags = buildMeta({ ...page, noindex: true });
    expect(tags).toContainEqual({ name: 'robots', content: 'noindex, nofollow' });
    expect(tags.some((tag) => 'rel' in tag)).toBe(false);
  });

  it('renders JSON-LD entries', () => {
    const tags = buildMeta({ ...page, jsonLd: { '@type': 'Thing' } });
    expect(tags).toContainEqual({ 'script:ld+json': { '@type': 'Thing' } });
  });
});
