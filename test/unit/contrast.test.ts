import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Reads the token files themselves, so a palette change that breaks
// contrast fails CI instead of shipping.
const stylesDir = fileURLToPath(new URL('../../app/assets/styles/tokens/', import.meta.url))
const primitivesScss = readFileSync(`${stylesDir}_primitives.scss`, 'utf8')
const semanticScss = readFileSync(`${stylesDir}_semantic.scss`, 'utf8')

const primitives = Object.fromEntries(
  [...primitivesScss.matchAll(/^\$([\w-]+):\s*(#[0-9a-f]{6});/gim)].map(([, name, hex]) => [
    name,
    hex,
  ]),
)

/** Semantic tokens of one theme block, resolved to hex. rgba() values are skipped. */
function theme(selector: string): Record<string, string> {
  const start = semanticScss.indexOf(`${selector} {`)
  const block = semanticScss.slice(start, semanticScss.indexOf('\n}', start))
  return Object.fromEntries(
    [...block.matchAll(/--color-([\w-]+):\s*#\{p\.\$([\w-]+)\};/g)].map(([, token, primitive]) => [
      token,
      primitives[primitive!],
    ]),
  )
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

const themes = { light: theme(':root'), dark: theme('.dark') }
const surfaces = ['bg', 'surface', 'surface-raised']
const textTokens = ['text', 'text-muted', 'accent']

describe.each(Object.entries(themes))('%s theme', (_, tokens) => {
  it('resolves every token to a palette color', () => {
    for (const name of [...surfaces, ...textTokens, 'accent-fill', 'on-accent']) {
      expect(tokens[name], name).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it.each(textTokens.flatMap((text) => surfaces.map((surface) => [text, surface])))(
    '%s on %s meets WCAG AA (4.5:1)',
    (text, surface) => {
      expect(contrast(tokens[text!]!, tokens[surface!]!)).toBeGreaterThanOrEqual(4.5)
    },
  )

  it('text on the accent fill meets WCAG AA', () => {
    expect(contrast(tokens['on-accent']!, tokens['accent-fill']!)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(['terminal-text', 'terminal-prompt'])('%s on the terminal meets WCAG AA', (text) => {
    expect(contrast(tokens[text]!, tokens['terminal-bg']!)).toBeGreaterThanOrEqual(4.5)
  })

  it('has no pure white or black', () => {
    for (const hex of Object.values(tokens)) {
      expect(hex.toLowerCase()).not.toMatch(/^#(000000|ffffff)$/)
    }
  })
})
