import { Link } from 'react-router';

import { useI18n } from '#shared/i18n';
import { Icon } from '#shared/ui';
import { formatDate } from '#shared/utils/format-date';

import type { Post } from '../types';

import { useBlogText } from '../i18n';
import './post-view.css';

/** Article page body. */
export function PostView({ post }: { post: Post }) {
  const { locale, href } = useI18n();
  const text = useBlogText();

  return (
    <article className="section">
      <div className="container post">
        <Link to={href('/blog')} className="post__back">
          <Icon name="arrow-left" size={16} />
          {text.backToBlog}
        </Link>
        <header className="post__header">
          <p className="post__meta">
            {text.publishedOn} <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>{' '}
            · {post.readingMinutes} {text.minutesRead}
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
