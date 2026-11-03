import { describe, expect, it } from 'vitest';

import type { Post } from '../types';

import { getPost, getPosts, getPostSlugs } from './posts';
import { toPostSummary, toPublishedPosts } from './posts.mapper';

const base: Post = {
  slug: 'a',
  title: 'A',
  excerpt: 'A',
  publishedAt: '2026-01-01',
  readingMinutes: 1,
  tags: [],
  body: ['x'],
  draft: false,
};

describe('posts mapper', () => {
  it('drops drafts and sorts newest first', () => {
    const posts = [
      { ...base, slug: 'old', publishedAt: '2026-01-01' },
      { ...base, slug: 'draft', publishedAt: '2026-03-01', draft: true },
      { ...base, slug: 'new', publishedAt: '2026-02-01' },
    ];
    expect(toPublishedPosts(posts).map((p) => p.slug)).toEqual(['new', 'old']);
  });

  it('strips the body from summaries', () => {
    expect(toPostSummary(base)).not.toHaveProperty('body');
  });
});

describe('posts actions', () => {
  it('returns the same slugs in every locale (hreflang pairs)', () => {
    expect(getPostSlugs('es')).toEqual(getPostSlugs('en'));
  });

  it('lists posts without bodies', async () => {
    const posts = await getPosts('es');
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).not.toHaveProperty('body');
  });

  it('returns null for an unknown slug', async () => {
    expect(await getPost('en', 'does-not-exist')).toBeNull();
  });
});
