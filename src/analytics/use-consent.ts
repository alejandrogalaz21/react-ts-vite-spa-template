import { useCallback, useSyncExternalStore } from 'react';

import { type ConsentChoice, readConsentChoice, subscribeConsent, writeConsentChoice } from './consent';
import { setAnalyticsConsent } from './ga';

/** Server snapshot: during prerender nobody has decided yet. */
const getServerSnapshot = () => null;

/**
 * Current consent choice plus a setter that persists it and updates GA4. Backed by
 * useSyncExternalStore, so every component reading it re-renders together.
 */
export function useConsent(): [ConsentChoice | null, (choice: ConsentChoice | null) => void] {
  const choice = useSyncExternalStore(subscribeConsent, readConsentChoice, getServerSnapshot);
  const setChoice = useCallback((next: ConsentChoice | null) => {
    writeConsentChoice(next);
    setAnalyticsConsent(next === 'granted');
  }, []);
  return [choice, setChoice];
}
