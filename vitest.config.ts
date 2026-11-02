import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Unit and component tests. Kept apart from vite.config.ts on purpose: the React Router plugin
 * expects a full app build and does not run inside Vitest, so tests use the plain React plugin.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  define: {
    __APP_VERSION__: JSON.stringify('0.0.0-test'),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // Route modules, views and purely presentational section components are covered by the
      // e2e suite (rendered, navigated and audited with axe); unit coverage targets logic.
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/root.tsx',
        'src/routes.ts',
        'src/routes/**',
        'src/sections/**/views/**',
        'src/sections/home/components/**',
        'src/layout/site-shell.tsx',
      ],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
