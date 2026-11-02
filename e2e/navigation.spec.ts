import { expect, type Page, test } from '@playwright/test';

/** On phones the nav lives behind the menu button. */
async function openNavIfCollapsed(page: Page) {
  const menu = page.getByRole('button', { name: /abrir menú|open menu/i });
  if (await menu.isVisible()) await menu.click();
}

test('home renders one h1 and navigates client-side to a blog post', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page).toHaveTitle(/Lorem Studio/);

  await openNavIfCollapsed(page);
  await page
    .getByRole('navigation', { name: 'Navegación principal' })
    .getByRole('link', { name: 'Blog' })
    .click();
  await expect(page).toHaveURL('/blog');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Notas y artículos');

  await page.getByRole('link', { name: 'Primeros pasos con lorem ipsum' }).click();
  await expect(page).toHaveURL('/blog/primeros-pasos');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Primeros pasos con lorem ipsum');
});

test('the locale switch keeps the page and updates <html lang>', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  await openNavIfCollapsed(page);
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Temporibus autem quibusdam');
});

test('the theme toggle switches and survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await openNavIfCollapsed(page);
  await page.getByRole('button', { name: 'Cambiar a tema oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('the footer shows the build version', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('build-label')).toHaveText(/^v\d+\.\d+\.\d+/);
});

test('pages hydrate without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  for (const path of ['/', '/en/blog', '/blog/primeros-pasos', '/contact']) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }
  expect(errors).toEqual([]);
});
