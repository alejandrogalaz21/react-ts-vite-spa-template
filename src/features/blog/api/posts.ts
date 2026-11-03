import { z } from 'zod';

import type { Locale } from '#shared/i18n/config';

import enPosts from '../content/en.json';
import esPosts from '../content/es.json';
import { type Post, postSchema, type PostSummary } from '../types';
import { toPostSummary, toPublishedPosts } from './posts.mapper';

/**
 * Data access for blog posts. react-router.config.ts also loads this module (via
 * src/app/routes/prerender.ts): the `#` aliases are Node subpath imports, so they resolve there too.
 *
 * Today the source is JSON bundled with the app; swapping it for a CMS
 * or an API only changes this file (the signatures are already async).
 */
const RAW: Record<Locale, unknown> = { es: esPosts, en: enPosts };

function load(locale: Locale): Post[] {
  return toPublishedPosts(z.array(postSchema).parse(RAW[locale]));
}

/** Published posts for a locale, newest first, without bodies. */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  return Promise.resolve(load(locale).map(toPostSummary));
}

/** One post, or `null` when the slug does not exist (the route turns that into a 404). */
export async function getPost(locale: Locale, slug: string): Promise<Post | null> {
  return Promise.resolve(load(locale).find((post) => post.slug === slug) ?? null);
}

/** Every published slug of a locale. Used by the prerender list. */
export function getPostSlugs(locale: Locale): string[] {
  return load(locale).map((post) => post.slug);
}
