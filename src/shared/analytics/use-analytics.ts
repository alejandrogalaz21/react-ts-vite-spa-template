import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { ANALYTICS_ENABLED, env } from '#shared/config/env';

import { readConsentChoice } from './consent';
import { initAnalytics, trackPageView } from './ga';

/**
 * Boots GA4 once (production builds with a measurement id only) and sends a `page_view` on every
 * client-side navigation. Mounted once, in the site layout.
 */
export function useAnalytics(enabled = ANALYTICS_ENABLED): void {
  const { pathname } = useLocation();

  useEffect(() => {
    if (enabled) initAnalytics(env.VITE_GA_MEASUREMENT_ID, readConsentChoice() === 'granted');
  }, [enabled]);

  useEffect(() => {
    // Runs after React commits the new route, so document.title already holds the new title.
    if (enabled) trackPageView(pathname, document.title);
  }, [enabled, pathname]);
}
