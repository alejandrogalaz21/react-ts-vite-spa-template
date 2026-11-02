import type { PostSummary } from '~/types/post';

import { SectionHeader } from '~/components/ui';
import { useI18n } from '~/i18n';

import { PostCard } from '../components/post-card';

/** Blog index body. Posts arrive from the route loader (resolved at build time). */
export function BlogListView({ posts }: { posts: PostSummary[] }) {
  const { t } = useI18n();

  return (
    <section className="section" aria-labelledby="blog-title">
      <div className="container">
        <SectionHeader
          as="h1"
          id="blog-title"
          eyebrow={t.blog.eyebrow}
          title={t.blog.title}
          lead={t.blog.lead}
        />
        {posts.length === 0 ? (
          <p>{t.blog.empty}</p>
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
