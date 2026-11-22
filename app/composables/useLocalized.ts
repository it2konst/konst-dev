export type Localized<T = string> = { en: T; ru: T }

/**
 * Picks the current language from content fields like { en, ru }, and
 * formats project dates (YYYY-MM) for that language.
 */
export function useLocalized() {
  const { locale } = useI18n()

  function pick<T>(value: Localized<T>): T {
    return locale.value === 'ru' ? value.ru : value.en
  }

  function formatMonth(yearMonth: string): string {
    const [year, month] = yearMonth.split('-').map(Number)
    // Noon UTC, so no time zone can move the date into another month
    const date = new Date(Date.UTC(year!, month! - 1, 1, 12))
    return new Intl.DateTimeFormat(locale.value, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date)
  }

  return { pick, formatMonth }
}
