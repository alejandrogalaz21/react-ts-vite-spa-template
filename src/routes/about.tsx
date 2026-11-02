import { getDictionary } from '~/i18n';
import { AboutView } from '~/sections/about/views/about-view';
import { breadcrumbJsonLd } from '~/seo/json-ld';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/about';

import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  const t = getDictionary(locale);
  return buildMeta({
    title: t.about.meta.title,
    description: t.about.meta.description,
    path: '/about',
    locale,
    jsonLd: breadcrumbJsonLd(locale, [
      [t.nav.home, '/'],
      [t.nav.about, '/about'],
    ]),
  });
}

export default function AboutRoute() {
  return <AboutView />;
}
