import { describe, expect, it, vi } from 'vitest';

import { isEnabled, isPageEnabled } from './flags';

vi.mock('#shared/config/features', () => ({
  features: {
    pages: { home: true, services: false },
    components: { themeToggle: true },
  },
}));

describe('isEnabled', () => {
  it('reads page and component flags from the config', () => {
    expect(isEnabled('pages.home')).toBe(true);
    expect(isEnabled('pages.services')).toBe(false);
    expect(isEnabled('components.themeToggle')).toBe(true);
  });

  it('treats a flag missing from the config as off', () => {
    expect(isEnabled('components.homeStats')).toBe(false);
  });
});

describe('isPageEnabled', () => {
  it('prefixes the page group', () => {
    expect(isPageEnabled('home')).toBe(true);
    expect(isPageEnabled('services')).toBe(false);
  });
});
