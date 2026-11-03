/**
 * Analytics consent of the visitor, persisted in localStorage. Every access is wrapped in
 * try/catch: storage throws in private windows or with site data blocked, and the site must work.
 */

export type ConsentChoice = 'granted' | 'denied';

/** Key of the persisted choice. Change the prefix per project if several sites share a domain. */
export const CONSENT_STORAGE_KEY = 'app.consent';

/** DOM event fired on every change, so all consumers (banner, privacy page) stay in sync. */
const CONSENT_EVENT = 'app:consent-change';

/** Persisted choice, or `null` when the visitor has not decided yet. */
export function readConsentChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

/** Persists a choice (or clears it with `null`) and notifies subscribers. */
export function writeConsentChoice(choice: ConsentChoice | null): void {
  try {
    if (choice === null) window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    else window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage unavailable: the in-memory update below still happens for this page view.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Subscribes to consent changes. Returns the unsubscribe function (useSyncExternalStore shape). */
export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
