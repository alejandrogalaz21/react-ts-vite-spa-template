import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * One page per template. WCAG 2.2 A/AA rules; any violation fails the build.
 * `/services` is off by default (src/shared/config/features.ts), so it covers the "coming soon" view.
 */
const PAGES = [
  '/',
  '/about',
  '/blog',
  '/blog/primeros-pasos',
  '/contact',
  '/privacy',
  '/services',
  '/en',
  '/404',
];

for (const path of PAGES) {
  for (const scheme of ['light', 'dark'] as const) {
    test(`${path} has no axe violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
      ).toEqual([]);
    });
  }
}
