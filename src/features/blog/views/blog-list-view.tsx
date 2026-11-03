import { SectionHeader } from '#shared/ui';

import type { PostSummary } from '../types';

import { PostCard } from '../components/post-card';
import { useBlogText } from '../i18n';

/** Blog index body. Posts arrive from the route loader (resolved at build time). */
export function BlogListView({ posts }: { posts: PostSummary[] }) {
  const text = useBlogText();

  return (
    <section className="section" aria-labelledby="blog-title">
      <div className="container">
        <SectionHeader as="h1" id="blog-title" eyebrow={text.eyebrow} title={text.title} lead={text.lead} />
        {posts.length === 0 ? (
          <p>{text.empty}</p>
        ) : (
          <ul className="grid-auto list-reset">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
