import { describe, expect, it } from 'vitest';

import type { Post } from '~/types/post';

import { articleJsonLd, breadcrumbJsonLd, organizationJsonLd, websiteJsonLd } from './json-ld';

const post: Post = {
  slug: 'hello',
  title: 'Hello',
  excerpt: 'Intro',
  publishedAt: '2026-10-20',
  readingMinutes: 3,
  tags: [],
  body: ['x'],
  draft: false,
};

describe('json-ld builders', () => {
  it('builds Organization and localized WebSite', () => {
    expect(organizationJsonLd()).toMatchObject({ '@type': 'Organization', url: 'https://example.com' });
    expect(websiteJsonLd('en')).toMatchObject({ url: 'https://example.com/en', inLanguage: 'en-US' });
  });

  it('builds a BlogPosting with the localized URL', () => {
    expect(articleJsonLd(post, 'es')).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Hello',
      datePublished: '2026-10-20',
      url: 'https://example.com/blog/hello',
      inLanguage: 'es-MX',
    });
  });

  it('numbers breadcrumb items from 1', () => {
    const crumbs = breadcrumbJsonLd('en', [
      ['Home', '/'],
      ['About', '/about'],
    ]);
    expect(crumbs.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/en' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://example.com/en/about' },
    ]);
  });
});
