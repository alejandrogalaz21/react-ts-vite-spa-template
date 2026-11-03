import { Link } from 'react-router';

import { env } from '#shared/config/env';
import { site } from '#shared/config/site';
import { FeatureGate } from '#shared/feature-flags';
import { useI18n } from '#shared/i18n';
import { formatBuildLabel } from '#shared/utils/build-label';

import './site-footer.css';

const BUILD_LABEL = formatBuildLabel(__APP_VERSION__, env.VITE_APP_COMMIT);

/** Site footer: copyright, legal links and the build label (tells deployed builds apart). */
export function SiteFooter() {
  const { t, href } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <p>
          © {year} {site.name}. {t.footer.rights}
        </p>
        <FeatureGate flag="pages.privacy">
          <nav aria-label={t.footer.privacy}>
            <Link to={href('/privacy')}>{t.footer.privacy}</Link>
          </nav>
        </FeatureGate>
        <p className="site-footer__build">
          <span className="visually-hidden">{t.footer.version}: </span>
          <span data-testid="build-label">{BUILD_LABEL}</span>
        </p>
      </div>
    </footer>
  );
}
