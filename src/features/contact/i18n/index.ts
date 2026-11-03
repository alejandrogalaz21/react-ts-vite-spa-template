import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { type ContactText, es } from './es';

/** Contact texts per locale. Use it in `meta`, where hooks are not available. */
export const contactText: LocaleTexts<ContactText> = { es, en };

/** Contact texts for the active locale. */
export function useContactText(): ContactText {
  return useLocaleText(contactText);
}
