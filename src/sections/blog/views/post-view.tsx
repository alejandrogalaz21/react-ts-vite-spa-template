import { Link } from 'react-router';

import type { Post } from '~/types/post';

import { Icon } from '~/components/ui';
import { useI18n } from '~/i18n';
import { formatDate } from '~/utils/format-date';

import './post-view.css';

/** Article page body. */
export function PostView({ post }: { post: Post }) {
  const { t, locale, href } = useI18n();

  return (
    <article className="section">
      <div className="container post">
        <Link to={href('/blog')} className="post__back">
          <Icon name="arrow-left" size={16} />
          {t.blog.backToBlog}
        </Link>
        <header className="post__header">
          <p className="post__meta">
            {t.blog.publishedOn}{' '}
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time> ·{' '}
            {post.readingMinutes} {t.blog.minutesRead}
          </p>
          <h1 className="text-h2">{post.title}</h1>
          <p className="text-lead">{post.excerpt}</p>
        </header>
        <div className="prose">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
