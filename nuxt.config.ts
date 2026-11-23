import { readdirSync } from 'node:fs'

// Every project page in both languages is listed for pre-rendering, so a
// page is built even if no link points to it yet
const projectRoutes = readdirSync('content/projects')
  .filter((file) => file.endsWith('.json'))
  .flatMap((file) => {
    const slug = file.replace(/\.json$/, '')
    return [`/projects/${slug}`, `/ru/projects/${slug}`]
  })

// Public address of the site. Used for hreflang and canonical links; set
// NUXT_PUBLIC_SITE_URL on the hosting if the site lives somewhere else.
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'https://konst-dev.vercel.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxt/image', '@nuxtjs/color-mode', '@nuxtjs/i18n'],
  typescript: {
    strict: true,
  },

  // Fonts are bundled with the site, so pages make no requests to font CDNs
  css: [
    '@fontsource-variable/onest/index.css',
    '@fontsource-variable/jetbrains-mono/index.css',
    '~/assets/styles/main.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/mixins" as *;\n',
        },
      },
    },
  },

  content: {
    experimental: {
      // Node's built-in SQLite (22.5+): no native module to compile on install
      sqliteConnector: 'native',
    },
  },

  image: {
    // Screenshots are resized and converted at build time: every page gets
    // AVIF with a WebP fallback, in the widths its layout actually needs.
    // Set explicitly, because on Vercel the module would otherwise switch to
    // Vercel's image service, which a static deployment doesn't have
    provider: 'ipxStatic',
    format: ['avif', 'webp'],
    quality: 70,
  },

  colorMode: {
    // "system" follows the OS; the user's choice is remembered in localStorage
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'konst-dev-theme',
  },

  nitro: {
    prerender: {
      routes: projectRoutes,
      // A broken internal link fails the build instead of shipping a 404
      failOnError: true,
    },
  },

  runtimeConfig: {
    public: { siteUrl },
  },

  i18n: {
    // English lives at /, Russian at /ru. Each page exists in both languages
    // with its own address, so search engines can index both.
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
    ],
    defaultLocale: 'en',
    baseUrl: siteUrl,
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      // Only the first visit to / is redirected; after that the choice is kept
      useCookie: true,
      cookieKey: 'konst-dev-locale',
      redirectOn: 'root',
    },
  },

  app: {
    head: {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
