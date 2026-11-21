<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('home.title') })
</script>

<template>
  <main class="container">
    <h1>{{ t('home.greeting') }}</h1>
    <p>{{ t('home.lead') }}</p>
    <ClientOnly>
      <UiThemeSwitch />
    </ClientOnly>
  </main>
</template>
