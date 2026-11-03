import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { es, type StatusText } from './es';

/** Status texts per locale. Use it in `meta`, where hooks are not available. */
export const statusText: LocaleTexts<StatusText> = { es, en };

/** Status texts for the active locale. */
export function useStatusText(): StatusText {
  return useLocaleText(statusText);
}
