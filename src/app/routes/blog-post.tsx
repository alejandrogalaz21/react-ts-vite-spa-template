import { data } from 'react-router';

import { getPost, PostView } from '#features/blog';
import { site } from '#shared/config/site';
import { isPageEnabled } from '#shared/feature-flags';
import { articleJsonLd } from '#shared/seo/json-ld';
import { buildMeta } from '#shared/seo/meta';

import type { Route } from './+types/blog-post';

import { getRouteLocale } from './route-locale';

export async function loader({ params, request }: Route.LoaderArgs) {
  const locale = getRouteLocale(request);
  // Posts are not prerendered while the blog is off (prerender.ts); keep the loader consistent.
  const post = isPageEnabled('blog') ? await getPost(locale, params.slug) : undefined;
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
