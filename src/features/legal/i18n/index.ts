import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { es, type LegalText } from './es';

/** Legal texts per locale. Use it in `meta`, where hooks are not available. */
export const legalText: LocaleTexts<LegalText> = { es, en };

/** Legal texts for the active locale. */
export function useLegalText(): LegalText {
  return useLocaleText(legalText);
}
