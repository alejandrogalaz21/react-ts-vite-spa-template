import { expect, test } from '@playwright/test';

test('the contact form validates, then sends', async ({ page }) => {
  await page.goto('/contact');

  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  const name = page.getByRole('textbox', { name: 'Nombre' });
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Escribe tu nombre.')).toBeVisible();

  await name.fill('Ada Lovelace');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('ada@example.com');
  await page
    .getByRole('textbox', { name: 'Mensaje' })
    .fill('Lorem ipsum dolor sit amet, consectetur adipiscing.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();

  // No VITE_API_URL in this build: the send is simulated.
  await expect(page.getByRole('status')).toHaveText(/Recibimos tu mensaje/);
});
