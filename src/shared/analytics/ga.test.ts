import { afterEach, describe, expect, it } from 'vitest';

import { initAnalytics, setAnalyticsConsent, track, trackPageView } from './ga';

afterEach(() => {
  delete window.gtag;
  delete window.dataLayer;
  document.head.querySelectorAll('script[src*="googletagmanager"]').forEach((node) => node.remove());
});

/** dataLayer entries are `arguments` objects; turn them into arrays to compare. */
const calls = () => (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));

describe('ga', () => {
  it('is a silent no-op before initialisation', () => {
    expect(() => {
      track('x');
      trackPageView('/', 'Home');
      setAnalyticsConsent(true);
    }).not.toThrow();
    expect(window.dataLayer).toBeUndefined();
  });

  it('queues a denied consent default before loading gtag.js', () => {
    initAnalytics('G-TEST12345', false);
    const [first] = calls();
    expect(first).toEqual(['consent', 'default', expect.objectContaining({ analytics_storage: 'denied' })]);
    expect(document.head.querySelector('script[src*="id=G-TEST12345"]')).not.toBeNull();
  });

  it('starts granted when the visitor already accepted', () => {
    initAnalytics('G-TEST12345', true);
    expect(calls()[0]?.[2]).toMatchObject({ analytics_storage: 'granted' });
  });

  it('disables automatic page views (the router sends them)', () => {
    initAnalytics('G-TEST12345', false);
    expect(calls()).toContainEqual(['config', 'G-TEST12345', { send_page_view: false }]);
  });

  it('sends events with the beacon transport and consent updates', () => {
    initAnalytics('G-TEST12345', false);
    track('contact_submit', { status: 'success' });
    setAnalyticsConsent(true);
    expect(calls()).toContainEqual([
      'event',
      'contact_submit',
      { status: 'success', transport_type: 'beacon' },
    ]);
    expect(calls()).toContainEqual(['consent', 'update', { analytics_storage: 'granted' }]);
  });

  it('does nothing without a measurement id', () => {
    initAnalytics('', false);
    expect(window.gtag).toBeUndefined();
  });
});
