/**
 * Google Analytics 4 without a library.
 *
 * `gtag.js` is injected by {@link initAnalytics}; every call goes through the `dataLayer` queue, so
 * nothing depends on the script having loaded. Consent Mode v2 starts with every storage type
 * denied: GA4 sends cookieless pings until {@link setAnalyticsConsent} grants `analytics_storage`.
 *
 * When GA4 is not initialised (development, preview builds, no measurement id) every export is a
 * silent no-op, so components can call {@link track} unconditionally.
 */

/** Parameters allowed on a custom event: flat, primitive, never personal data. */
export type EventParams = Record<string, string | number | boolean>;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** Where Google serves gtag.js. Must be allowed by the CSP `script-src` of the host. */
const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';

/**
 * Loads GA4. The consent default is queued before the script tag exists, so Google reads it before
 * sending anything. `send_page_view` is off: the router sends one per navigation
 * ({@link trackPageView}). Calling it twice is harmless.
 *
 * @param measurementId - `G-...` id of the GA4 web data stream. Public by design.
 * @param granted - Consent already given in a previous visit.
 */
export function initAnalytics(measurementId: string, granted: boolean): void {
  if (window.gtag || !measurementId) return;

  window.dataLayer = window.dataLayer ?? [];
  // gtag() must push its `arguments` object, not a spread array: the library reads it by shape.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `${GTAG_SRC}?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

/** Sends a `page_view` for a client-side navigation. No-op without GA4. */
export function trackPageView(path: string, title: string): void {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

/**
 * Sends a custom event with the beacon transport (survives a navigation away). No-op without GA4.
 *
 * @param event - `snake_case` name, e.g. `contact_submit`.
 * @param params - Flat parameters. Never names, emails or message text.
 */
export function track(event: string, params: EventParams = {}): void {
  window.gtag?.('event', event, { ...params, transport_type: 'beacon' });
}

/** Applies the choice of the visitor. Granting turns cookies on from now on. No-op without GA4. */
export function setAnalyticsConsent(granted: boolean): void {
  window.gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
}
