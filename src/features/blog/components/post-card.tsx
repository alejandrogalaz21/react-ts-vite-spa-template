import { Link } from 'react-router';

import { useI18n } from '#shared/i18n';
import { Card } from '#shared/ui';
import { formatDate } from '#shared/utils/format-date';

import type { PostSummary } from '../types';

import { useBlogText } from '../i18n';

/** Blog list item: date and reading time, linked title, excerpt. */
export function PostCard({ post }: { post: PostSummary }) {
  const { locale, href } = useI18n();
  const text = useBlogText();

  return (
    <Card
      headingLevel={2}
      meta={
        <>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time> ·{' '}
          {post.readingMinutes} {text.minutesRead}
        </>
      }
      title={<Link to={href(`/blog/${post.slug}`)}>{post.title}</Link>}
    >
      {post.excerpt}
    </Card>
  );
}
