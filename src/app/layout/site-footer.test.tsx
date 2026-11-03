import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '#shared/test/render';

import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('shows the build label and a localized privacy link', () => {
    renderWithProviders(<SiteFooter />, { path: '/en' });
    expect(screen.getByTestId('build-label')).toHaveTextContent('v0.0.0-test');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/en/privacy');
  });
});
