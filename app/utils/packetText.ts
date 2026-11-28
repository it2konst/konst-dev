export interface PacketChar {
  char: string
  /** Animation delay in milliseconds. */
  delay: number
}

/**
 * Splits a line into words and characters, and gives each character an
 * arrival delay in a shuffled but fixed order, the way UDP datagrams arrive
 * out of order and still add up to the whole message.
 *
 * The order is a pure function of the position, so the pre-rendered HTML and
 * the page in the browser always agree, and the animation needs no script.
 */
export function packetText(text: string, spread = 520): PacketChar[][] {
  const words = text.split(' ').filter(Boolean)
  const total = words.reduce((sum, word) => sum + [...word].length, 0)
  let index = 0
  return words.map((word) =>
    [...word].map((char) => {
      // A fixed scramble: neighbours land far apart in time
      const slot = (index * 7 + 3) % 11
      const drift = index / Math.max(total - 1, 1)
      index++
      // Mostly scrambled, with a slight left-to-right drift so the line
      // still settles from the start to the end
      return { char, delay: Math.round(((slot / 10) * 0.65 + drift * 0.35) * spread) }
    }),
  )
}
