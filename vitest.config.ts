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
    setupFiles: ['./src/shared/test/setup.ts'],
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
        'src/**/index.ts',
        'src/shared/test/**',
        'src/app/root.tsx',
        'src/app/routes.ts',
        'src/app/routes/**',
        'src/app/layout/site-shell.tsx',
        'src/features/*/views/**',
        'src/features/home/components/**',
      ],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
