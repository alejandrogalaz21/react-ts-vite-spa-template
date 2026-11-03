import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FeatureGate } from './feature-gate';

vi.mock('#shared/config/features', () => ({
  features: {
    pages: { home: true, services: false },
    components: {},
  },
}));

describe('FeatureGate', () => {
  it('renders its children when the flag is on', () => {
    render(<FeatureGate flag="pages.home">visible</FeatureGate>);
    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('renders nothing when the flag is off', () => {
    const { container } = render(<FeatureGate flag="pages.services">hidden</FeatureGate>);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the fallback when the flag is off', () => {
    render(
      <FeatureGate flag="pages.services" fallback="coming soon">
        hidden
      </FeatureGate>,
    );
    expect(screen.getByText('coming soon')).toBeInTheDocument();
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });
});
