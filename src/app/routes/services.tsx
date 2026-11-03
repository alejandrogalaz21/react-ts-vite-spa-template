import { servicesText, ServicesView } from '#features/services';
import { ComingSoonView } from '#features/status';
import { FeatureGate, isPageEnabled } from '#shared/feature-flags';
import { getDictionary } from '#shared/i18n';
import { breadcrumbJsonLd } from '#shared/seo/json-ld';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/services';

import { comingSoonMeta } from './coming-soon-meta';
import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  if (!isPageEnabled('services')) return comingSoonMeta(locale, '/services');
  const t = getDictionary(locale);
  return buildMeta({
    title: servicesText[locale].meta.title,
    description: servicesText[locale].meta.description,
    path: '/services',
    locale,
    jsonLd: breadcrumbJsonLd(locale, [
      [t.nav.home, '/'],
      [t.nav.services, '/services'],
    ]),
  });
}

export default function ServicesRoute() {
  return (
    <FeatureGate flag="pages.services" fallback={<ComingSoonView />}>
      <ServicesView />
    </FeatureGate>
  );
}
