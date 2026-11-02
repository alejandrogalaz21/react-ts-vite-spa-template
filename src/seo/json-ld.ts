import type { Post } from '~/types/post';

import { absoluteUrl, site } from '~/config/site';
import { type Locale, LOCALE_TAGS, localizePath } from '~/i18n/config';

/**
 * schema.org builders. Data comes from site config and content, never hardcoded per page.
 * Validate output with https://validator.schema.org when changing a builder.
 */

const BCP47 = (locale: Locale) => LOCALE_TAGS[locale].replace('_', '-');

/** `Organization`: who publishes the site. Rendered on the home page. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    logo: absoluteUrl('/icon-512.png'),
  };
}

/** `WebSite` for a locale. Rendered on the home page. */
export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl(localizePath('/', locale)),
    inLanguage: BCP47(locale),
  };
}

/** `BlogPosting` for an article page. */
export function articleJsonLd(post: Post, locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    inLanguage: BCP47(locale),
    url: absoluteUrl(localizePath(`/blog/${post.slug}`, locale)),
    image: absoluteUrl(site.defaultOgImage),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  };
}

/** `BreadcrumbList` from `[name, locale-neutral path]` pairs. */
export function breadcrumbJsonLd(
  locale: Locale,
  items: [name: string, path: string][],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(localizePath(path, locale)),
    })),
  };
}
