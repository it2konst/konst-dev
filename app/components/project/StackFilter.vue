<script setup lang="ts">
// One technology at a time, or all. Toggle buttons with aria-pressed, the
// same pattern as the theme switch.
defineProps<{ options: StackOption[]; total: number }>()
const selected = defineModel<StackId | null>({ required: true })

const { t } = useI18n()
</script>

<template>
  <div class="stack-filter" role="group" aria-labelledby="stack-filter-label">
    <p id="stack-filter-label" class="stack-filter__label">{{ t('filter.label') }}</p>
    <ul role="list" class="stack-filter__list">
      <li>
        <button
          type="button"
          class="stack-filter__option"
          :aria-pressed="selected === null"
          @click="selected = null"
        >
          {{ t('filter.all') }}
          <span class="stack-filter__count">{{ total }}</span>
        </button>
      </li>
      <li v-for="option in options" :key="option.id">
        <button
          type="button"
          class="stack-filter__option"
          :aria-pressed="selected === option.id"
          @click="selected = selected === option.id ? null : option.id"
        >
          {{ option.label }}
          <span class="stack-filter__count">{{ option.count }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.stack-filter {
  display: grid;
  gap: var(--space-3);
}

.stack-filter__label {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.stack-filter__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.stack-filter__option {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-2);
  min-height: 2.25rem;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-sm);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-text-muted);
  }

  &[aria-pressed='true'] {
    border-color: var(--color-accent-fill);
    background: var(--color-accent-fill);
    color: var(--color-on-accent);
    font-weight: var(--weight-semibold);

    .stack-filter__count {
      color: inherit;
    }
  }
}

.stack-filter__count {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
