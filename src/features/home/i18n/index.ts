import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { es, type HomeText } from './es';

/** Home texts per locale. Use it in `meta`, where hooks are not available. */
export const homeText: LocaleTexts<HomeText> = { es, en };

/** Home texts for the active locale. */
export function useHomeText(): HomeText {
  return useLocaleText(homeText);
}
