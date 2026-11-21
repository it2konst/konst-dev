<script setup lang="ts">
const { t } = useI18n()

// lang and dir on <html>, plus alternate links for each language
const i18nHead = useLocaleHead()

useHead({
  htmlAttrs: { lang: () => i18nHead.value.htmlAttrs.lang },
  titleTemplate: (title) => (title ? `${title} | ${t('site.name')}` : t('site.name')),
  link: () => i18nHead.value.link ?? [],
  meta: () => i18nHead.value.meta ?? [],
})
</script>

<template>
  <NuxtPage />
</template>
