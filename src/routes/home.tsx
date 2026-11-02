import { getDictionary } from '~/i18n';
import { HomeView } from '~/sections/home/views/home-view';
import { organizationJsonLd, websiteJsonLd } from '~/seo/json-ld';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/home';

import { getRouteLocale } from './route-locale';

/**
 * Route modules are thin: resolve params and data (`loader`, runs at build time), declare the
 * `<head>` (`meta`) and render one view. No markup or logic beyond that.
 */
export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  const t = getDictionary(locale).home.meta;
  return buildMeta({
    title: t.title,
    description: t.description,
    path: '/',
    locale,
    jsonLd: [organizationJsonLd(), websiteJsonLd(locale)],
  });
}

export default function HomeRoute() {
  return <HomeView />;
}
