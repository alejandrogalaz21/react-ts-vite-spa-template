import { Link } from 'react-router';

import { isPageEnabled } from '#shared/feature-flags';
import { useI18n } from '#shared/i18n';
import { buttonClassName } from '#shared/ui';

import { useStatusText } from '../i18n';

/** Body of a page whose flag is off (src/shared/config/features.ts). Rendered at the page's own URL. */
export function ComingSoonView() {
  const { href } = useI18n();
  const copy = useStatusText().comingSoon;

  return (
    <section className="section" aria-labelledby="coming-soon-title">
      <div className="container stack">
        <p className="text-eyebrow">{copy.eyebrow}</p>
        <h1 id="coming-soon-title" className="text-h2">
          {copy.title}
        </h1>
        <p className="text-lead">{copy.body}</p>
        <div className="cluster">
          <Link to={href('/')} className={buttonClassName()}>
            {copy.backHome}
          </Link>
          {isPageEnabled('contact') && (
            <Link to={href('/contact')} className={buttonClassName({ variant: 'secondary' })}>
              {copy.contact}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
