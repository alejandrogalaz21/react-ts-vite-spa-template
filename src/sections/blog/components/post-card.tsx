import { Link } from 'react-router';

import type { PostSummary } from '~/types/post';

import { Card } from '~/components/ui';
import { useI18n } from '~/i18n';
import { formatDate } from '~/utils/format-date';

/** Blog list item: date and reading time, linked title, excerpt. */
export function PostCard({ post }: { post: PostSummary }) {
  const { t, locale, href } = useI18n();

  return (
    <Card
      headingLevel={2}
      meta={
        <>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time> ·{' '}
          {post.readingMinutes} {t.blog.minutesRead}
        </>
      }
      title={<Link to={href(`/blog/${post.slug}`)}>{post.title}</Link>}
    >
      {post.excerpt}
    </Card>
  );
}
