<script setup lang="ts">
// With two languages a single link to the other one is clearer than a menu.
// It points to the same page in the other language, so nobody lands on home.
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const other = computed(() => locales.value.find((l) => l.code !== locale.value)!)
</script>

<template>
  <NuxtLink
    class="locale-switch"
    :to="switchLocalePath(other.code)"
    :lang="other.language"
    :hreflang="other.language"
    :aria-label="t('locale.switchTo')"
    :title="t('locale.switchTo')"
  >
    {{ t('locale.switchToShort') }}
  </NuxtLink>
</template>

<style scoped lang="scss">
.locale-switch {
  display: grid;
  place-items: center;
  min-width: 2.5rem;
  height: 2.25rem;
  padding-inline: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-text);
  }
}
</style>
