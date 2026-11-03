import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '#shared/test/render';

import { SiteHeader } from './site-header';

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe('SiteHeader', () => {
  it('marks the current page in the primary navigation', () => {
    renderWithProviders(<SiteHeader />, { path: '/blog' });
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent('Blog');
  });

  it('leaves pages whose flag is off out of the navigation', () => {
    renderWithProviders(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' });
    expect(within(nav).getByRole('link', { name: 'Blog' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Servicios' })).not.toBeInTheDocument();
  });

  it('links each locale to the same page', () => {
    renderWithProviders(<SiteHeader />, { path: '/en/about' });
    expect(screen.getByRole('link', { name: 'ES' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('aria-current', 'true');
  });

  it('opens and closes the mobile menu', async () => {
    renderWithProviders(<SiteHeader />);
    const button = screen.getByRole('button', { name: 'Abrir menú' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles and persists the theme', async () => {
    document.documentElement.dataset.theme = 'light';
    renderWithProviders(<SiteHeader />);
    await userEvent.click(screen.getByRole('button', { name: 'Cambiar a tema oscuro' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('app.theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument();
  });
});
