export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
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

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
