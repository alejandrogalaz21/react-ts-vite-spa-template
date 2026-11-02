import { type APIRequestContext, expect, test } from '@playwright/test';

/** Every URL listed in the sitemap: the contract between prerender, postbuild and the host. */
async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get('/sitemap.xml')).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? '').pathname);
}

test('robots.txt points to the sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/^Sitemap: https?:\/\/.+\/sitemap\.xml$/m);
});

test('every sitemap URL is served as prerendered HTML with its SEO tags', async ({ request }) => {
  const paths = await sitemapPaths(request);
  expect(paths.length).toBeGreaterThan(10);

  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    // Content is in the HTML itself, not injected by JS: crawlers and link previews see it.
    expect(html.match(/<h1[\s>]/g)?.length, `${path} h1 count`).toBe(1);
    expect(html, path).toMatch(/<title>[^<]+<\/title>/);
    expect(html, path).toMatch(/<meta name="description" content="[^"]+"/);
    expect(html, path).toMatch(/<link rel="canonical" href="[^"]+"/);
    expect(html, path).toMatch(/<meta property="og:image" content="https?:\/\/[^"]+"/);
  }
});

test('blog posts carry BlogPosting structured data', async ({ request }) => {
  const html = await (await request.get('/en/blog/primeros-pasos')).text();
  const json = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
  expect(JSON.parse(json ?? '{}')).toMatchObject({ '@type': 'BlogPosting', inLanguage: 'en-US' });
});

test('unknown paths answer 404 with a noindex page', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página no encontrada');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
