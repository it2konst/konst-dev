<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="page">
    <a href="#main" class="skip-link">{{ t('a11y.skipToContent') }}</a>
    <LayoutTheHeader />
    <main id="main" tabindex="-1" class="page__main">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.page__main {
  flex: 1;
  padding-block: var(--space-16) var(--space-24);

  &:focus {
    outline: none;
  }
}

.skip-link {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 10;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-accent-fill);
  color: var(--color-on-accent);
  font-weight: var(--weight-semibold);
  text-decoration: none;
  transform: translateY(-200%);

  &:focus-visible {
    transform: none;
  }
}
</style>
