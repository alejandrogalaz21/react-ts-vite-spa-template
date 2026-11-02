import { Link } from 'react-router';

import { buttonClassName, Icon } from '~/components/ui';
import { useI18n } from '~/i18n';

import './hero.css';

/** Above-the-fold block: the page h1, lead, two calls to action and the hero illustration. */
export function Hero() {
  const { t, href } = useI18n();
  const copy = t.home.hero;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="hero__eyebrow text-eyebrow">{copy.eyebrow}</p>
          <h1 id="hero-title" className="text-display">
            {copy.title}
          </h1>
          <p className="hero__lead text-lead">{copy.lead}</p>
          <div className="hero__actions">
            <Link to={href('/contact')} className={buttonClassName()}>
              {copy.primaryCta}
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link to={href('/blog')} className={buttonClassName({ variant: 'secondary' })}>
              {copy.secondaryCta}
            </Link>
          </div>
        </div>
        {/* LCP image: explicit size, eager, high priority. Everything below the fold is lazy. */}
        <img
          className="hero__art"
          src="/hero.svg"
          alt={copy.imageAlt}
          width={560}
          height={480}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
}
