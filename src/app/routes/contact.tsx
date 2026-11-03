import { contactText, ContactView } from '#features/contact';
import { ComingSoonView } from '#features/status';
import { FeatureGate, isPageEnabled } from '#shared/feature-flags';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/contact';

import { comingSoonMeta } from './coming-soon-meta';
import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  if (!isPageEnabled('contact')) return comingSoonMeta(locale, '/contact');
  const t = contactText[locale].meta;
  return buildMeta({ title: t.title, description: t.description, path: '/contact', locale });
}

export default function ContactRoute() {
  return (
    <FeatureGate flag="pages.contact" fallback={<ComingSoonView />}>
      <ContactView />
    </FeatureGate>
  );
}
