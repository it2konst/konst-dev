/**
 * Every technology a project can list. Projects refer to these ids, so a
 * typo fails the build instead of creating a new tag, and filters stay
 * consistent. To use something new, add it here first.
 */
export type StackKind = 'language' | 'framework' | 'library' | 'platform' | 'tooling'

export interface StackItem {
  label: string
  kind: StackKind
}

export const STACK = {
  typescript: { label: 'TypeScript', kind: 'language' },
  javascript: { label: 'JavaScript', kind: 'language' },
  html: { label: 'HTML', kind: 'language' },
  css: { label: 'CSS', kind: 'language' },
  go: { label: 'Go', kind: 'language' },

  vue: { label: 'Vue 3', kind: 'framework' },
  nuxt: { label: 'Nuxt', kind: 'framework' },
  'xray-core': { label: 'Xray-core', kind: 'framework' },

  vuetify: { label: 'Vuetify', kind: 'library' },
  pinia: { label: 'Pinia', kind: 'library' },
  'vue-i18n': { label: 'vue-i18n', kind: 'library' },
  svgo: { label: 'SVGO', kind: 'library' },

  pwa: { label: 'PWA', kind: 'platform' },
  'canvas-api': { label: 'Canvas API', kind: 'platform' },
  'web-workers': { label: 'Web Workers', kind: 'platform' },
  'web-crypto': { label: 'Web Crypto', kind: 'platform' },
  indexeddb: { label: 'IndexedDB', kind: 'platform' },
  udp: { label: 'UDP', kind: 'platform' },
  linux: { label: 'Linux', kind: 'platform' },

  vite: { label: 'Vite', kind: 'tooling' },
  vitest: { label: 'Vitest', kind: 'tooling' },
  'github-actions': { label: 'GitHub Actions', kind: 'tooling' },
} as const satisfies Record<string, StackItem>

export type StackId = keyof typeof STACK

export const STACK_IDS = Object.keys(STACK) as [StackId, ...StackId[]]
