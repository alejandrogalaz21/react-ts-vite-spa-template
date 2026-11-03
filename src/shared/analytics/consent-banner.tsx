import { Link } from 'react-router';

import { ANALYTICS_ENABLED } from '#shared/config/env';
import { useI18n } from '#shared/i18n';
import { Button } from '#shared/ui';

import { useConsent } from './use-consent';
import './consent-banner.css';

export interface ConsentBannerProps {
  /** Defaults to ANALYTICS_ENABLED; tests and stories pass it explicitly. */
  enabled?: boolean;
}

/**
 * Asks for analytics consent once. Hidden when analytics is off (dev, previews, no measurement id)
 * or when the visitor already decided. A non-modal region: it never blocks the page.
 */
export function ConsentBanner({ enabled = ANALYTICS_ENABLED }: ConsentBannerProps) {
  const { t, href } = useI18n();
  const [choice, setChoice] = useConsent();

  if (!enabled || choice !== null) return null;

  return (
    <section className="consent-banner" aria-label={t.consent.title}>
      <p className="consent-banner__text">
        {t.consent.message} <Link to={href('/privacy')}>{t.consent.learnMore}</Link>
      </p>
      <div className="consent-banner__actions">
        <Button variant="secondary" size="sm" onClick={() => setChoice('denied')}>
          {t.consent.reject}
        </Button>
        <Button size="sm" onClick={() => setChoice('granted')}>
          {t.consent.accept}
        </Button>
      </div>
    </section>
  );
}
