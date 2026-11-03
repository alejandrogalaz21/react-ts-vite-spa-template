import { legalText, PrivacyView } from '#features/legal';
import { ComingSoonView } from '#features/status';
import { FeatureGate, isPageEnabled } from '#shared/feature-flags';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/privacy';

import { comingSoonMeta } from './coming-soon-meta';
import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  if (!isPageEnabled('privacy')) return comingSoonMeta(locale, '/privacy');
  const t = legalText[locale].privacy.meta;
  return buildMeta({ title: t.title, description: t.description, path: '/privacy', locale });
}

export default function PrivacyRoute() {
  return (
    <FeatureGate flag="pages.privacy" fallback={<ComingSoonView />}>
      <PrivacyView />
    </FeatureGate>
  );
}
