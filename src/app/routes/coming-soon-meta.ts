import type { MetaDescriptor } from 'react-router';

import { statusText } from '#features/status';
import { type Locale } from '#shared/i18n';
import { buildMeta } from '#shared/seo/meta';

/**
 * `<head>` of a page whose flag is off: the "coming soon" copy with `noindex`, so postbuild leaves
 * it out of sitemap.xml until the flag is turned on.
 *
 * @param locale - Locale of the request.
 * @param path - Locale-neutral path of the page (`/services`).
 */
export function comingSoonMeta(locale: Locale, path: string): MetaDescriptor[] {
  const t = statusText[locale].comingSoon;
  return buildMeta({ title: t.metaTitle, description: t.body, path, locale, noindex: true });
}
