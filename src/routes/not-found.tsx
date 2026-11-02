import { getDictionary, localeFromPathname, useI18n } from '~/i18n';
import { ErrorView } from '~/sections/errors/views/error-view';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/not-found';

/**
 * Catch-all route. Prerendered as `/404/index.html`; the host serves that file (with status 404)
 * for any path that has no file of its own.
 */
export function meta({ location }: Route.MetaArgs) {
  const locale = localeFromPathname(location.pathname);
  const t = getDictionary(locale).notFound;
  return buildMeta({
    title: t.metaTitle,
    description: t.body,
    path: location.pathname,
    locale,
    noindex: true,
  });
}

export default function NotFoundRoute() {
  const { t } = useI18n();
  return <ErrorView title={t.notFound.title} body={t.notFound.body} />;
}
