<script setup lang="ts">
// With `linked`, each tag opens the project list filtered by that technology.
const props = defineProps<{ stack: StackId[]; linked?: boolean }>()

const { t } = useI18n()
const localePath = useLocalePath()

const items = computed(() => props.stack.map((id) => ({ id, ...STACK[id] })))
</script>

<template>
  <ul role="list" class="stack-tags">
    <li v-for="item in items" :key="item.id">
      <NuxtLink
        v-if="linked"
        :to="localePath({ path: '/projects', query: { stack: item.id } })"
        class="stack-tags__item stack-tags__item--link"
        :aria-label="t('filter.showWith', { tech: item.label })"
        >{{ item.label }}</NuxtLink
      >
      <span v-else class="stack-tags__item">{{ item.label }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.stack-tags__item {
  display: inline-block;
  padding: 0.125rem var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
  white-space: nowrap;
}

.stack-tags__item--link {
  text-decoration: none;
  transition:
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-text);
    border-color: var(--color-accent);
  }
}
</style>
