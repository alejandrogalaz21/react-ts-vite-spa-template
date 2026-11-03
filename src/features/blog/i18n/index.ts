import { type LocaleTexts, useLocaleText } from '#shared/i18n';

import { en } from './en';
import { type BlogText, es } from './es';

/** Blog texts per locale. Use it in `meta`, where hooks are not available. */
export const blogText: LocaleTexts<BlogText> = { es, en };

/** Blog texts for the active locale. */
export function useBlogText(): BlogText {
  return useLocaleText(blogText);
}
