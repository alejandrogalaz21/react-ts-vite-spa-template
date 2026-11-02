import { z } from 'zod';

/**
 * Schema of every `VITE_*` variable the app reads. Shared by vite.config.ts (fails the build early)
 * and src/config/env.ts (typed runtime access), so the rules exist once.
 *
 * Everything here is public: Vite inlines these values into the bundle.
 */
const envSchema = z.object({
  VITE_SITE_URL: z
    .url()
    .default('https://example.com')
    .transform((url) => url.replace(/\/+$/, '')),
  VITE_ALLOW_INDEXING: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  VITE_GA_MEASUREMENT_ID: z
    .string()
    .trim()
    .regex(/^(G-[A-Z0-9]{6,12})?$/, 'expected a GA4 measurement id like G-XXXXXXXXXX')
    .default(''),
  VITE_API_URL: z
    .union([z.literal(''), z.url()])
    .default('')
    .transform((url) => url.replace(/\/+$/, '')),
  VITE_APP_COMMIT: z.string().trim().default(''),
});

/** Validated, typed environment. */
export type Env = z.output<typeof envSchema>;

/**
 * Parses raw environment values. Empty strings count as "unset" so a blank line in `.env` or an
 * empty CI variable falls back to the default instead of failing.
 *
 * @throws Error listing every invalid variable.
 */
export function parseEnv(raw: Record<string, unknown>): Env {
  const cleaned = Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== ''));
  const result = envSchema.safeParse(cleaned);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid environment variables:\n${issues.join('\n')}`);
  }
  return result.data;
}
