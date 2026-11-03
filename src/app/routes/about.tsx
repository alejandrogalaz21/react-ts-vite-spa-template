import { aboutText, AboutView } from '#features/about';
import { ComingSoonView } from '#features/status';
import { FeatureGate, isPageEnabled } from '#shared/feature-flags';
import { getDictionary } from '#shared/i18n';
import { breadcrumbJsonLd } from '#shared/seo/json-ld';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/about';

import { comingSoonMeta } from './coming-soon-meta';
import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  if (!isPageEnabled('about')) return comingSoonMeta(locale, '/about');
  const t = getDictionary(locale);
  return buildMeta({
    title: aboutText[locale].meta.title,
    description: aboutText[locale].meta.description,
    path: '/about',
    locale,
    jsonLd: breadcrumbJsonLd(locale, [
      [t.nav.home, '/'],
      [t.nav.about, '/about'],
    ]),
  });
}

export default function AboutRoute() {
  return (
    <FeatureGate flag="pages.about" fallback={<ComingSoonView />}>
      <AboutView />
    </FeatureGate>
  );
}
