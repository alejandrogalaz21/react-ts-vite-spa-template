import { parseEnv } from './env.schema';

/** Typed, validated public configuration. Import this instead of reading `import.meta.env`. */
export const env = parseEnv(import.meta.env);

/** GA4 only loads in a production build with a measurement id: `npm run dev` never talks to Google. */
export const ANALYTICS_ENABLED = import.meta.env.PROD && env.VITE_GA_MEASUREMENT_ID !== '';
