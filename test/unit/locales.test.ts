import { describe, expect, it } from 'vitest'
import en from '../../i18n/locales/en.json'
import ru from '../../i18n/locales/ru.json'

type Messages = { [key: string]: string | Messages }

function flatten(messages: Messages, prefix = ''): Record<string, string> {
  return Object.entries(messages).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') acc[path] = value
    else Object.assign(acc, flatten(value, path))
    return acc
  }, {})
}

const locales = { en: flatten(en), ru: flatten(ru) }

describe('translations', () => {
  it('have the same keys in English and Russian', () => {
    expect(Object.keys(locales.ru).sort()).toEqual(Object.keys(locales.en).sort())
  })

  it.each(Object.entries(locales))('has no empty strings in %s', (_, messages) => {
    const empty = Object.entries(messages).filter(([, text]) => text.trim() === '')
    expect(empty).toEqual([])
  })

  // House style: hyphens and colons instead of long dashes
  it.each(Object.entries(locales))('uses no em or en dashes in %s', (_, messages) => {
    const withDashes = Object.entries(messages).filter(([, text]) => /[\u2013\u2014]/.test(text))
    expect(withDashes).toEqual([])
  })

  it('switches to the other language in each locale', () => {
    expect(locales.en['locale.switchTo']).toBe('Русский')
    expect(locales.ru['locale.switchTo']).toBe('English')
  })
})
