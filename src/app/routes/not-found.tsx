import { NotFoundView, statusText } from '#features/status';
import { localeFromPathname } from '#shared/i18n';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/not-found';

/**
 * Catch-all route. Prerendered as `/404/index.html`; the host serves that file (with status 404)
 * for any path that has no file of its own.
 */
export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = statusText[locale].notFound;
  return buildMeta({
    title: t.metaTitle,
    description: t.body,
    path: location.pathname,
    locale,
    noindex: true,
  });
}

export default function NotFoundRoute() {
  return <NotFoundView />;
}
