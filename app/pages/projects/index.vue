<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('projects.title') })
</script>

<template>
  <section class="container page-intro" aria-labelledby="projects-title">
    <h1 id="projects-title">{{ t('projects.title') }}</h1>
    <p class="page-intro__lead">{{ t('projects.lead') }}</p>
    <p class="page-intro__note">{{ t('projects.empty') }}</p>
  </section>
</template>
