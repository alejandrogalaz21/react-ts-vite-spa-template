import { describe, expect, it } from 'vitest';

import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats per locale', () => {
    expect(formatDate('2026-10-20', 'es')).toBe('20 de octubre de 2026');
    expect(formatDate('2026-10-20', 'en')).toBe('October 20, 2026');
  });

  it('never shifts the day (UTC)', () => {
    expect(formatDate('2026-01-01', 'en')).toBe('January 1, 2026');
  });
});
