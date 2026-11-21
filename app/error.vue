<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

useSiteHead()

const notFound = computed(() => props.error.statusCode === 404)

useHead({ title: () => (notFound.value ? t('error.notFound') : t('error.generic')) })

function goHome() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <NuxtLayout>
    <section class="container page-intro" aria-labelledby="error-title">
      <p class="error__code" aria-hidden="true">{{ error.statusCode }}</p>
      <h1 id="error-title">{{ notFound ? t('error.notFound') : t('error.generic') }}</h1>
      <p class="page-intro__lead">
        {{ notFound ? t('error.notFoundText') : t('error.genericText') }}
      </p>
      <div>
        <button type="button" class="button button--primary" @click="goHome">
          {{ t('error.home') }}
        </button>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.error__code {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  color: var(--color-accent);
}
</style>
