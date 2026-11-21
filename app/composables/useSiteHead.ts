/**
 * Head tags shared by every page, including the error page, which Nuxt
 * renders instead of app.vue: lang on <html>, the title suffix, the site
 * description, a canonical link and hreflang alternates for each language.
 */
export function useSiteHead() {
  const { t } = useI18n()
  const i18nHead = useLocaleHead()

  useHead({
    htmlAttrs: { lang: () => i18nHead.value.htmlAttrs.lang },
    titleTemplate: (title) => (title ? `${title} | ${t('site.name')}` : t('site.name')),
    link: () => i18nHead.value.link ?? [],
    meta: () => i18nHead.value.meta ?? [],
  })

  useSeoMeta({
    description: () => t('site.description'),
  })
}
