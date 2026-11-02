import { getDictionary } from '~/i18n';
import { ContactView } from '~/sections/contact/views/contact-view';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/contact';

import { getRouteLocale } from './route-locale';

export function loader({ request }: Route.LoaderArgs) {
  return { locale: getRouteLocale(request) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  const t = getDictionary(locale).contact.meta;
  return buildMeta({ title: t.title, description: t.description, path: '/contact', locale });
}

export default function ContactRoute() {
  return <ContactView />;
}
