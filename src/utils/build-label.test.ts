import { describe, expect, it } from 'vitest';

import { formatBuildLabel } from './build-label';

describe('formatBuildLabel', () => {
  it('adds the short commit when known', () => {
    expect(formatBuildLabel('1.2.3', 'f32f5431c0ffee')).toBe('v1.2.3 · f32f543');
  });

  it('shows the version alone without a commit', () => {
    expect(formatBuildLabel('1.2.3')).toBe('v1.2.3');
    expect(formatBuildLabel('1.2.3', '  ')).toBe('v1.2.3');
  });
});
