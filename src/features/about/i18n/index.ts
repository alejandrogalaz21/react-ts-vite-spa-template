import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { type AboutText, es } from './es';

/** About texts per locale. Use it in `meta`, where hooks are not available. */
export const aboutText: LocaleTexts<AboutText> = { es, en };

/** About texts for the active locale. */
export function useAboutText(): AboutText {
  return useLocaleText(aboutText);
}
