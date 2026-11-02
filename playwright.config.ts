import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/**
 * e2e runs against the production build served by scripts/serve-static.mjs, the same files that
 * ship and the same clean-URL/404 contract as the host. Phone first, desktop for layout checks.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${PORT}`, trace: 'on-first-retry' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    // CI builds in a previous step; locally the build runs first so the suite never tests stale files.
    command: `${process.env.CI ? '' : 'npm run build && '}node scripts/serve-static.mjs`,
    url: `http://localhost:${PORT}`,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
