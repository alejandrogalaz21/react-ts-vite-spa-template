import { describe, expect, it, vi } from 'vitest';

import { features } from '#shared/config/features';

import { getPrerenderPaths } from './prerender';

vi.mock('#shared/config/features', () => ({
  features: {
    pages: { home: true, about: true, blog: true, contact: true, privacy: true, services: false },
    components: {},
  },
}));

describe('getPrerenderPaths', () => {
  it('prerenders pages whose flag is off, so their URL serves "coming soon"', () => {
    expect(getPrerenderPaths()).toEqual(expect.arrayContaining(['/services', '/en/services', '/404']));
  });

  it('lists blog posts only while the blog is on', () => {
    expect(getPrerenderPaths()).toContain('/blog/primeros-pasos');
    features.pages.blog = false;
    const paths = getPrerenderPaths();
    expect(paths).toContain('/blog');
    expect(paths.some((path) => path.includes('/blog/'))).toBe(false);
    features.pages.blog = true;
  });
});
