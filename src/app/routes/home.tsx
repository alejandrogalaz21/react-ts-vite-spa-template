import { homeText, HomeView } from '#features/home';
import { ComingSoonView } from '#features/status';
import { FeatureGate, isPageEnabled } from '#shared/feature-flags';
import { organizationJsonLd, websiteJsonLd } from '#shared/seo/json-ld';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/home';

import { comingSoonMeta } from './coming-soon-meta';
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
  if (!isPageEnabled('home')) return comingSoonMeta(locale, '/');
  const t = homeText[locale].meta;
  return buildMeta({
    title: t.title,
    description: t.description,
    path: '/',
    locale,
    jsonLd: [organizationJsonLd(), websiteJsonLd(locale)],
  });
}

export default function HomeRoute() {
  return (
    <FeatureGate flag="pages.home" fallback={<ComingSoonView />}>
      <HomeView />
    </FeatureGate>
  );
}
