import { describe, expect, it } from 'vitest'
import { packetText } from '../../app/utils/packetText'

const flat = (text: string, spread?: number) => packetText(text, spread).flat()

describe('packetText', () => {
  it('keeps every character, in reading order, grouped by word', () => {
    const words = packetText("Hi, I'm Konstantin.")
    expect(words.map((word) => word.map((c) => c.char).join(''))).toEqual([
      'Hi,',
      "I'm",
      'Konstantin.',
    ])
  })

  it('handles Cyrillic and repeated spaces', () => {
    const words = packetText('Привет,  я Константин.')
    expect(words.map((word) => word.map((c) => c.char).join(''))).toEqual([
      'Привет,',
      'я',
      'Константин.',
    ])
  })

  it('keeps every delay within the spread', () => {
    for (const { delay } of flat("Hi, I'm Konstantin.", 500)) {
      expect(delay).toBeGreaterThanOrEqual(0)
      expect(delay).toBeLessThanOrEqual(500)
    }
  })

  it('gives the same delays every time, so server and browser agree', () => {
    expect(packetText('Привет, я Константин.')).toEqual(packetText('Привет, я Константин.'))
  })

  it('lets letters arrive out of order', () => {
    const delays = flat("Hi, I'm Konstantin.").map((c) => c.delay)
    const sorted = [...delays].sort((a, b) => a - b)
    expect(delays).not.toEqual(sorted)
  })

  it('still settles from the start: the first half lands earlier on average', () => {
    const delays = flat('Hi, I am Konstantin and I build tools.').map((c) => c.delay)
    const half = Math.floor(delays.length / 2)
    const avg = (list: number[]) => list.reduce((a, b) => a + b, 0) / list.length
    expect(avg(delays.slice(0, half))).toBeLessThan(avg(delays.slice(half)))
  })

  it('returns nothing for an empty line', () => {
    expect(packetText('')).toEqual([])
  })
})
