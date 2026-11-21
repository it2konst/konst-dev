<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: () => t('home.title') })
</script>

<template>
  <section class="container hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="hero__title">{{ t('home.greeting') }}</h1>
    <p class="hero__role">{{ t('home.title') }}</p>
    <p class="hero__lead">{{ t('home.lead') }}</p>
    <div class="hero__actions">
      <NuxtLink :to="localePath('/projects')" class="button button--primary">
        {{ t('home.seeProjects') }}
      </NuxtLink>
      <a href="https://github.com/it2konst" class="button button--quiet" rel="me">
        {{ t('home.github') }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  display: grid;
  gap: var(--space-6);
}

.hero__title {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  letter-spacing: -0.03em;
  max-width: 14ch;
}

.hero__role {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
}

.hero__lead {
  font-size: var(--text-md);
  max-width: 52ch;

  @include from(md) {
    font-size: var(--text-lg);
    line-height: 1.5;
  }
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
</style>
