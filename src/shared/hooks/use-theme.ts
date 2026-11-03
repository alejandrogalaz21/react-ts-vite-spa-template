import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

/** Same key public/theme-init.js reads before first paint (avoids a flash of the wrong theme). */
const THEME_STORAGE_KEY = 'app.theme';
const THEME_EVENT = 'app:theme-change';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

/**
 * Active color theme and a toggle. The initial value is set by public/theme-init.js from the saved
 * choice or `prefers-color-scheme`; this hook only reads and changes `<html data-theme>`.
 */
export function useTheme(): [Theme, () => void] {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light' as const);
  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the theme still changes for this visit.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);
  return [theme, toggle];
}
