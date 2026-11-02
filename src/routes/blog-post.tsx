import { data } from 'react-router';

import { getPost } from '~/actions/posts';
import { site } from '~/config/site';
import { PostView } from '~/sections/blog/views/post-view';
import { articleJsonLd } from '~/seo/json-ld';
import { buildMeta } from '~/seo/meta';

import type { Route } from './+types/blog-post';

import { getRouteLocale } from './route-locale';

export async function loader({ params, request }: Route.LoaderArgs) {
  const locale = getRouteLocale(request);
  const post = await getPost(locale, params.slug);
  if (!post) throw data(null, { status: 404 });
  return { locale, post };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { locale, post } = loaderData;
  return buildMeta({
    title: `${post.title} · ${site.name}`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    locale,
    type: 'article',
    jsonLd: articleJsonLd(post, locale),
  });
}

export default function BlogPostRoute({ loaderData }: Route.ComponentProps) {
  return <PostView post={loaderData.post} />;
}
