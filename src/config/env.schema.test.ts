import { describe, expect, it } from 'vitest';

import { parseEnv } from './env.schema';

describe('parseEnv', () => {
  it('applies defaults when variables are unset or empty', () => {
    expect(parseEnv({ VITE_SITE_URL: '', VITE_API_URL: '' })).toEqual({
      VITE_SITE_URL: 'https://example.com',
      VITE_ALLOW_INDEXING: true,
      VITE_GA_MEASUREMENT_ID: '',
      VITE_API_URL: '',
      VITE_APP_COMMIT: '',
    });
  });

  it('strips trailing slashes from URLs', () => {
    const env = parseEnv({ VITE_SITE_URL: 'https://lorem.dev/', VITE_API_URL: 'https://api.lorem.dev/' });
    expect(env.VITE_SITE_URL).toBe('https://lorem.dev');
    expect(env.VITE_API_URL).toBe('https://api.lorem.dev');
  });

  it('turns VITE_ALLOW_INDEXING into a boolean', () => {
    expect(parseEnv({ VITE_ALLOW_INDEXING: 'false' }).VITE_ALLOW_INDEXING).toBe(false);
  });

  it('rejects a malformed GA4 id and names the variable', () => {
    expect(() => parseEnv({ VITE_GA_MEASUREMENT_ID: 'UA-123' })).toThrow(/VITE_GA_MEASUREMENT_ID/);
  });

  it('rejects a site URL that is not a URL', () => {
    expect(() => parseEnv({ VITE_SITE_URL: 'lorem.dev' })).toThrow(/VITE_SITE_URL/);
  });
});
