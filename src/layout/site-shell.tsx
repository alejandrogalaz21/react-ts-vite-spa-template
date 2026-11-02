import type { ReactNode } from 'react';

import { ConsentBanner, useAnalytics } from '~/analytics';

import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

/**
 * Page chrome shared by every route: skip link target, header, main landmark, footer, consent
 * banner and analytics page views.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  useAnalytics();
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <ConsentBanner />
    </>
  );
}
