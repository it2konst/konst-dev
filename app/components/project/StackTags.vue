<script setup lang="ts">
const props = defineProps<{ stack: StackId[] }>()

const items = computed(() => props.stack.map((id) => ({ id, ...STACK[id] })))
</script>

<template>
  <ul role="list" class="stack-tags">
    <li v-for="item in items" :key="item.id" class="stack-tags__item" :data-kind="item.kind">
      {{ item.label }}
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
  padding: 0.125rem var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 1.5;
  white-space: nowrap;
}
</style>
