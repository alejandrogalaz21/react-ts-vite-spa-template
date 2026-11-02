import { getDictionary } from '~/i18n';
import { PrivacyView } from '~/sections/legal/views/privacy-view';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/privacy';

import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  const t = getDictionary(locale).privacy.meta;
  return buildMeta({ title: t.title, description: t.description, path: '/privacy', locale });
}

export default function PrivacyRoute() {
  return <PrivacyView />;
}
