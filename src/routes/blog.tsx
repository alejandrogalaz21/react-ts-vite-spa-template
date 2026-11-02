import { getPosts } from '~/actions/posts';
import { getDictionary } from '~/i18n';
import { BlogListView } from '~/sections/blog/views/blog-list-view';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/blog';

import { getRouteLocale } from './route-locale';

export async function loader({ request }: Route.LoaderArgs) {
  const locale = getRouteLocale(request);
  return { locale, posts: await getPosts(locale) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale } = loaderData;
  const t = getDictionary(locale).blog.meta;
  return buildMeta({ title: t.title, description: t.description, path: '/blog', locale });
}

export default function BlogRoute({ loaderData }: Route.ComponentProps) {
  return <BlogListView posts={loaderData.posts} />;
}
