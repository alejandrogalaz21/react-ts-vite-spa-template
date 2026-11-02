import { type Locale, LOCALE_TAGS } from '~/i18n/config';

/**
 * Formats an ISO date (`2026-10-20`) for humans in the given locale: `20 de octubre de 2026`.
 * Parsed as UTC so the day never shifts with the time zone of the build machine or the visitor.
 */
export function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale].replace('_', '-'), {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
