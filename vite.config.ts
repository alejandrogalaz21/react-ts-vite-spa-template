import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';

import pkg from './package.json' with { type: 'json' };
import { parseEnv } from './src/config/env.schema.ts';

export default defineConfig(({ mode }) => {
  // Fail the build before anything is bundled when a VITE_* variable is malformed. The same schema
  // validates `import.meta.env` at runtime (src/config/env.ts), so the rules live in one place.
  parseEnv(loadEnv(mode, process.cwd(), 'VITE_'));

  return {
    plugins: [reactRouter()],
    resolve: { tsconfigPaths: true },
    // Build identity shown in the footer (`v0.1.0 · abc1234`). Defined here so the bundle carries
    // the version string and not the whole package.json.
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    server: { port: 5173 },
  };
});
