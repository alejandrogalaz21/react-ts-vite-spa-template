import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '#shared/test/render';

import { CONSENT_STORAGE_KEY } from './consent';
import { ConsentBanner } from './consent-banner';

describe('ConsentBanner', () => {
  it('renders nothing when analytics is disabled', () => {
    renderWithProviders(<ConsentBanner enabled={false} />);
    expect(screen.queryByRole('button', { name: 'Aceptar' })).not.toBeInTheDocument();
  });

  it('persists the choice and hides itself', async () => {
    renderWithProviders(<ConsentBanner enabled />);
    await userEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('granted');
    expect(screen.queryByRole('button', { name: 'Aceptar' })).not.toBeInTheDocument();
  });

  it('is not shown again once the visitor decided', () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
    renderWithProviders(<ConsentBanner enabled />);
    expect(screen.queryByRole('button', { name: 'Rechazar' })).not.toBeInTheDocument();
  });

  it('speaks the language of the URL', () => {
    renderWithProviders(<ConsentBanner enabled />, { path: '/en' });
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
  });
});
