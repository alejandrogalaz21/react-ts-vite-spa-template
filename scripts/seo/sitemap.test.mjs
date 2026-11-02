import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  extractPageLinks,
  planSitemap,
  renderRobots,
  renderSitemap,
  routeFromFile,
  SitemapError,
} from './sitemap.mjs';

const ORIGIN = 'https://lorem.dev';

const head = ({ canonical, alternates = [], noindex = false }) =>
  `<html><head>${noindex ? '<meta name="robots" content="noindex, nofollow"/>' : '<meta name="robots" content="index, follow"/>'}` +
  (canonical ? `<link rel="canonical" href="${canonical}"/>` : '') +
  alternates.map(([lang, href]) => `<link rel="alternate" hrefLang="${lang}" href="${href}"/>`).join('') +
  '</head><body></body></html>';

const pair = [
  ['es', `${ORIGIN}/about`],
  ['en', `${ORIGIN}/en/about`],
  ['x-default', `${ORIGIN}/about`],
];

const page = (file, html) => ({ file, route: routeFromFile(file), links: extractPageLinks(html) });

test('routeFromFile maps nested index files to clean URLs', () => {
  assert.equal(routeFromFile('index.html'), '/');
  assert.equal(routeFromFile('en\\about\\index.html'), '/en/about');
  assert.equal(routeFromFile('404/index.html'), '/404');
});

test('extractPageLinks reads canonical, alternates (any attribute case) and noindex', () => {
  const links = extractPageLinks(head({ canonical: `${ORIGIN}/about`, alternates: pair }));
  assert.equal(links.canonical, `${ORIGIN}/about`);
  assert.equal(links.alternates.length, 3);
  assert.equal(links.noindex, false);
  assert.equal(extractPageLinks(head({ noindex: true })).noindex, true);
});

test('planSitemap lists indexable pages and skips noindex ones', () => {
  const entries = planSitemap({
    origin: ORIGIN,
    pages: [
      page('about/index.html', head({ canonical: `${ORIGIN}/about`, alternates: pair })),
      page('en/about/index.html', head({ canonical: `${ORIGIN}/en/about`, alternates: pair })),
      page('404/index.html', head({ noindex: true })),
    ],
  });
  assert.deepEqual(
    entries.map((e) => e.loc),
    [`${ORIGIN}/about`, `${ORIGIN}/en/about`],
  );
});

test('planSitemap rejects a missing canonical, a foreign origin and a canonical to another route', () => {
  assert.throws(() => planSitemap({ origin: ORIGIN, pages: [page('a/index.html', head({}))] }), SitemapError);
  assert.throws(
    () =>
      planSitemap({
        origin: ORIGIN,
        pages: [page('a/index.html', head({ canonical: 'https://other.dev/a' }))],
      }),
    /not under/,
  );
  assert.throws(
    () => planSitemap({ origin: ORIGIN, pages: [page('a/index.html', head({ canonical: `${ORIGIN}/b` }))] }),
    /does not point/,
  );
});

test('planSitemap rejects non-reciprocal hreflang', () => {
  assert.throws(
    () =>
      planSitemap({
        origin: ORIGIN,
        pages: [
          page('about/index.html', head({ canonical: `${ORIGIN}/about`, alternates: pair })),
          page('en/about/index.html', head({ canonical: `${ORIGIN}/en/about`, alternates: [pair[1]] })),
        ],
      }),
    /reciprocal/,
  );
});

test('renderSitemap escapes and nests alternates', () => {
  const xml = renderSitemap([
    { loc: `${ORIGIN}/a?x=1&y=2`, alternates: [{ hreflang: 'en', href: `${ORIGIN}/en/a` }] },
  ]);
  assert.match(xml, /<loc>https:\/\/lorem.dev\/a\?x=1&amp;y=2<\/loc>/);
  assert.match(xml, /<xhtml:link rel="alternate" hreflang="en" href="https:\/\/lorem.dev\/en\/a"\/>/);
});

test('renderRobots closes non-indexable builds', () => {
  assert.equal(renderRobots({ origin: ORIGIN, allowIndexing: false }), 'User-agent: *\nDisallow: /\n');
  assert.match(
    renderRobots({ origin: ORIGIN, allowIndexing: true }),
    /Sitemap: https:\/\/lorem.dev\/sitemap.xml/,
  );
});
