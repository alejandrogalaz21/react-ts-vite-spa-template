import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { es, type ServicesText } from './es';

/** Services texts per locale. Use it in `meta`, where hooks are not available. */
export const servicesText: LocaleTexts<ServicesText> = { es, en };

/** Services texts for the active locale. */
export function useServicesText(): ServicesText {
  return useLocaleText(servicesText);
}
