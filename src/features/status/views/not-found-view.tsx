import { Link } from 'react-router';

import { isPageEnabled, type PageName } from '#shared/feature-flags';
import { useI18n } from '#shared/i18n';
import { buttonClassName } from '#shared/ui';

import { useStatusText } from '../i18n';
import './not-found-view.css';

/** Pages suggested on the 404, in display order. Pages whose flag is off are skipped. */
const SUGGESTIONS = [
  { page: 'about', path: '/about' },
  { page: 'blog', path: '/blog' },
  { page: 'contact', path: '/contact' },
] as const satisfies readonly { page: PageName; path: string }[];

/** Body of the 404 page: what happened, the way home and a few pages that do exist. */
export function NotFoundView() {
  const { href, t } = useI18n();
  const copy = useStatusText().notFound;
  const suggestions = SUGGESTIONS.filter((item) => isPageEnabled(item.page));

  return (
    <section className="section" aria-labelledby="not-found-title">
      <div className="container stack">
        <p className="text-eyebrow">{copy.eyebrow}</p>
        <h1 id="not-found-title" className="text-h2">
          {copy.title}
        </h1>
        <p className="text-lead">{copy.body}</p>
        <Link to={href('/')} className={buttonClassName()}>
          {copy.backHome}
        </Link>
        {suggestions.length > 0 && (
          <nav className="not-found__suggestions" aria-labelledby="not-found-suggestions">
            <h2 id="not-found-suggestions" className="not-found__suggestions-title text-eyebrow">
              {copy.suggestions}
            </h2>
            <ul className="not-found__suggestions-list cluster list-reset">
              {suggestions.map((item) => (
                <li key={item.page}>
                  <Link to={href(item.path)} className="not-found__suggestion">
                    {t.nav[item.page]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
