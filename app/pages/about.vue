<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('about.title') })
</script>

<template>
  <section class="container page-intro" aria-labelledby="about-title">
    <h1 id="about-title">{{ t('about.title') }}</h1>
    <p class="page-intro__lead">{{ t('about.lead') }}</p>
    <p class="page-intro__note">{{ t('about.empty') }}</p>
  </section>
</template>
