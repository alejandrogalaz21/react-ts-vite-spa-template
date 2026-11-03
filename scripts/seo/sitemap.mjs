/**
 * Pure helpers behind scripts/postbuild.mjs: read the SEO tags of a prerendered page, validate the
 * whole set and serialize sitemap.xml / robots.txt. No filesystem access, so sitemap.test.mjs
 * covers every rule with plain strings.
 *
 * The tags are machine-generated (src/shared/seo/meta.ts), so targeted regexes over <head> are enough;
 * anything they do not understand ends in a SitemapError instead of a silently wrong file.
 */

/** Thrown for every condition that must stop the build. The message names the offending page. */
export class SitemapError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SitemapError';
  }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** Decodes the HTML entities a serializer may emit in attribute values. */
export function decodeEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, ref) => {
    if (ref[0] === '#') {
      const code = /^#x/i.test(ref) ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return ENTITIES[ref.toLowerCase()] ?? match;
  });
}

/** Escapes a value for XML text or a double-quoted attribute. */
export function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Attributes of one start tag as a lowercase-name map with decoded values. */
export function parseAttributes(tag) {
  const attrs = {};
  const body = tag.replace(/^<\s*[\w-]+/, '').replace(/\/?>$/, '');
  for (const m of body.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

/**
 * SEO facts of one page, read from its <head>: canonical (first wins, `null` when absent), every
 * `rel="alternate"` with `hreflang`, and whether a robots meta says `noindex`.
 */
export function extractPageLinks(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : html;
  let canonical = null;
  const alternates = [];
  for (const [tag] of head.matchAll(/<link\b[^>]*>/gi)) {
    const a = parseAttributes(tag);
    const rels = (a.rel ?? '').toLowerCase().split(/\s+/);
    if (rels.includes('canonical') && canonical === null && a.href) canonical = a.href;
    if (rels.includes('alternate') && a.hreflang && a.href)
      alternates.push({ hreflang: a.hreflang, href: a.href });
  }
  let noindex = false;
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/gi)) {
    const a = parseAttributes(tag);
    if ((a.name ?? '').toLowerCase() === 'robots' && /(^|[\s,])noindex([\s,]|$)/i.test(a.content ?? '')) {
      noindex = true;
    }
  }
  return { canonical, alternates, noindex };
}

/**
 * Route served by a file under build/client (relative path, either slash):
 * `index.html` → `/`, `en/about/index.html` → `/en/about`. Matches the clean-URL contract of the host.
 */
export function routeFromFile(file) {
  const path = file.replace(/\\/g, '/').replace(/^\.?\//, '');
  const route = path.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  return `/${route}`.replace(/\/+$/, '') || '/';
}

const pathOf = (url) => new URL(url).pathname.replace(/\/+$/, '') || '/';
const usesOrigin = (url, origin) => url === origin || url.startsWith(`${origin}/`);
const altKey = (alternates) =>
  alternates
    .map(({ hreflang, href }) => `${hreflang} ${href}`)
    .sort()
    .join('|');

/**
 * Validates every page and returns the sitemap entries sorted by `loc`.
 *
 * Throws SitemapError when an indexable page (no `noindex`) has no canonical, a canonical that does
 * not point at its own route, a URL outside `origin`, or hreflang alternates that are not
 * reciprocal; or when no page is indexable.
 *
 * @param {{ pages: { file: string, route: string, links: ReturnType<typeof extractPageLinks> }[], origin: string }} input
 */
export function planSitemap({ pages, origin }) {
  const indexable = pages.filter((page) => !page.links.noindex);
  const byRoute = new Map(indexable.map((page) => [page.route, page]));
  const entries = [];

  for (const page of indexable) {
    const { canonical, alternates } = page.links;
    if (!canonical) throw new SitemapError(`${page.file}: indexable page without <link rel="canonical">`);
    for (const url of [canonical, ...alternates.map((a) => a.href)]) {
      if (!usesOrigin(url, origin)) throw new SitemapError(`${page.file}: ${url} is not under ${origin}`);
    }
    if (pathOf(canonical) !== page.route) {
      throw new SitemapError(`${page.file}: canonical ${canonical} does not point to ${page.route}`);
    }
    for (const alternate of alternates) {
      const target = byRoute.get(pathOf(alternate.href));
      if (target && altKey(target.links.alternates) !== altKey(alternates)) {
        throw new SitemapError(
          `${page.file}: hreflang set differs from ${target.file} (alternates must be reciprocal)`,
        );
      }
    }
    entries.push({ loc: canonical, alternates });
  }

  if (entries.length === 0) throw new SitemapError('no indexable page found');
  return entries.sort((a, b) => a.loc.localeCompare(b.loc));
}

/** Serializes entries as sitemap.xml with `xhtml:link` alternates. */
export function renderSitemap(entries) {
  const urls = entries.map(({ loc, alternates }) => {
    const links = alternates.map(
      ({ hreflang, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`,
    );
    return ['  <url>', `    <loc>${escapeXml(loc)}</loc>`, ...links, '  </url>'].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

/** robots.txt: open with a Sitemap line, or closed for non-indexable builds (staging, previews). */
export function renderRobots({ origin, allowIndexing }) {
  if (!allowIndexing) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
}
