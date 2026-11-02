import type { MetaDescriptor } from 'react-router';

import { absoluteUrl, site } from '~/config/site';
import { DEFAULT_LOCALE, type Locale, LOCALE_TAGS, LOCALES, localizePath } from '~/i18n/config';

/** Everything a page declares about itself for search engines and link previews. */
export interface PageMeta {
  title: string;
  description: string;
  /** Locale-neutral path of the page (`/about`, `/blog/my-post`). */
  path: string;
  locale: Locale;
  /** Site-relative or absolute image for Open Graph/Twitter. Defaults to site.defaultOgImage. */
  image?: string;
  type?: 'website' | 'article';
  /** Forces `noindex` (404, thank-you pages). Non-production builds are noindex regardless. */
  noindex?: boolean;
  /** Locales where this page exists. Defaults to every locale. */
  locales?: readonly Locale[];
  /** Structured data, rendered as `<script type="application/ld+json">`. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Builds the full `<head>` set for a route's `meta` export: title, description, canonical,
 * hreflang alternates (+ x-default), robots, Open Graph, Twitter card and JSON-LD.
 *
 * scripts/postbuild.mjs reads these tags back from the prerendered HTML to write sitemap.xml and
 * fails the build when they are inconsistent, so this function is the only place that emits them.
 */
export function buildMeta(page: PageMeta): MetaDescriptor[] {
  const indexable = site.allowIndexing && !page.noindex;
  const url = absoluteUrl(localizePath(page.path, page.locale));
  const image = absoluteUrl(page.image ?? site.defaultOgImage);
  const locales = page.locales ?? LOCALES;

  const tags: MetaDescriptor[] = [
    { title: page.title },
    { name: 'description', content: page.description },
    { name: 'robots', content: indexable ? 'index, follow' : 'noindex, nofollow' },
    { property: 'og:type', content: page.type ?? 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: LOCALE_TAGS[page.locale] },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: site.twitterHandle },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.description },
    { name: 'twitter:image', content: image },
  ];

  if (indexable) {
    tags.push({ tagName: 'link', rel: 'canonical', href: url });
    if (locales.length > 1) {
      for (const locale of locales) {
        tags.push({
          tagName: 'link',
          rel: 'alternate',
          hrefLang: locale,
          href: absoluteUrl(localizePath(page.path, locale)),
        });
      }
      if (locales.includes(DEFAULT_LOCALE)) {
        tags.push({
          tagName: 'link',
          rel: 'alternate',
          hrefLang: 'x-default',
          href: absoluteUrl(localizePath(page.path, DEFAULT_LOCALE)),
        });
      }
    }
  }

  const jsonLd = page.jsonLd === undefined ? [] : Array.isArray(page.jsonLd) ? page.jsonLd : [page.jsonLd];
  for (const data of jsonLd) tags.push({ 'script:ld+json': data });

  return tags;
}
