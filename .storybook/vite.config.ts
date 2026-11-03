import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Minimal Vite config for Storybook: React + the `#` aliases, no React Router plugin. */
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  define: { __APP_VERSION__: JSON.stringify('0.0.0-storybook') },
});
