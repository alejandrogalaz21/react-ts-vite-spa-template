import { Link } from 'react-router';

import { useI18n } from '#shared/i18n';
import { buttonClassName } from '#shared/ui';

import { useStatusText } from '../i18n';

export interface ErrorViewProps {
  title: string;
  body: string;
  /** Stack trace, shown only in development. */
  stack?: string;
}

/** Shared body of the 404 page and the error boundaries. */
export function ErrorView({ title, body, stack }: ErrorViewProps) {
  const { href } = useI18n();
  const text = useStatusText();

  return (
    <section className="section" aria-labelledby="error-title">
      <div className="container stack">
        <h1 id="error-title" className="text-h2">
          {title}
        </h1>
        <p className="text-lead">{body}</p>
        <Link to={href('/')} className={buttonClassName()}>
          {text.notFound.backHome}
        </Link>
        {stack && (
          <pre style={{ overflowX: 'auto', fontSize: '0.8125rem' }}>
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </section>
  );
}
