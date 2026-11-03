import { BlogListView, blogText, getPosts } from '#features/blog';
import { ComingSoonView } from '#features/status';
import { FeatureGate, isPageEnabled } from '#shared/feature-flags';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/blog';

import { comingSoonMeta } from './coming-soon-meta';
import { getRouteLocale } from './route-locale';

export async function loader({ request }: Route.LoaderArgs) {
  const locale = getRouteLocale(request);
  return { locale, posts: await getPosts(locale) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  if (!isPageEnabled('blog')) return comingSoonMeta(locale, '/blog');
  const t = blogText[locale].meta;
  return buildMeta({ title: t.title, description: t.description, path: '/blog', locale });
}

export default function BlogRoute({ loaderData }: Route.ComponentProps) {
  return (
    <FeatureGate flag="pages.blog" fallback={<ComingSoonView />}>
      <BlogListView posts={loaderData.posts} />
    </FeatureGate>
  );
}
