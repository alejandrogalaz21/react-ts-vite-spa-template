import type { Post, PostSummary } from '../types';

/** Newest first; drafts never reach a page. */
export function toPublishedPosts(posts: Post[]): Post[] {
  return posts.filter((post) => !post.draft).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Strips the body for list views, so the list page does not ship every article. */
export function toPostSummary({ body: _body, ...summary }: Post): PostSummary {
  return summary;
}
