import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        // Plain TypeScript: content, translations, design tokens
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      // Components inside a real Nuxt app, with i18n and color-mode loaded
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: { domEnvironment: 'happy-dom' },
          },
        },
      }),
    ],
  },
})
