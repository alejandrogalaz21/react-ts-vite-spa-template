import { Link } from 'react-router';

import { buttonClassName } from '~/components/ui';
import { useI18n } from '~/i18n';

import './cta-band.css';

/** Closing call to action of the home page. */
export function CtaBand() {
  const { t, href } = useI18n();
  const copy = t.home.cta;

  return (
    <section className="section section--subtle" aria-labelledby="cta-title">
      <div className="cta-band container">
        <h2 id="cta-title" className="text-h2">
          {copy.title}
        </h2>
        <p className="text-lead">{copy.lead}</p>
        <Link to={href('/contact')} className={buttonClassName()}>
          {copy.button}
        </Link>
      </div>
    </section>
  );
}
