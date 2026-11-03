import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '#shared/test/render';

import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  it('shows translated errors and focuses the first invalid field', async () => {
    renderWithProviders(<ContactForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    const name = screen.getByRole('textbox', { name: 'Nombre' });
    expect(name).toHaveAccessibleDescription('Escribe tu nombre.');
    expect(name).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Correo electrónico' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('sends a valid message and announces success', async () => {
    renderWithProviders(<ContactForm />, { path: '/en/contact' });
    await userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
    await userEvent.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com');
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Message' }),
      'Lorem ipsum dolor sit amet, consectetur.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText(/We received your message/)).toBeInTheDocument();
  });
});
