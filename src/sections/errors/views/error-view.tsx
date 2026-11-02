import { Link } from 'react-router';

import { buttonClassName } from '~/components/ui';
import { useI18n } from '~/i18n';

export interface ErrorViewProps {
  title: string;
  body: string;
  /** Stack trace, shown only in development. */
  stack?: string;
}

/** Shared body of the 404 page and the error boundaries. */
export function ErrorView({ title, body, stack }: ErrorViewProps) {
  const { href, t } = useI18n();

  return (
    <section className="section" aria-labelledby="error-title">
      <div className="container stack">
        <h1 id="error-title" className="text-h2">
          {title}
        </h1>
        <p className="text-lead">{body}</p>
        <Link to={href('/')} className={buttonClassName()}>
          {t.notFound.backHome}
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
