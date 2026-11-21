<script setup lang="ts">
// Three-way switch: follow the system, or force light or dark.
// Toggle buttons with aria-pressed: each is reachable with Tab and screen
// readers announce which one is on.
const colorMode = useColorMode()
const { t } = useI18n()

const options = [
  { value: 'system', icon: 'system' },
  { value: 'light', icon: 'light' },
  { value: 'dark', icon: 'dark' },
] as const

function select(value: (typeof options)[number]['value']) {
  colorMode.preference = value
}
</script>

<template>
  <div class="theme-switch" role="group" :aria-label="t('theme.label')">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="theme-switch__option"
      :aria-pressed="colorMode.preference === option.value"
      :title="t(`theme.${option.value}`)"
      @click="select(option.value)"
    >
      <span class="visually-hidden">{{ t(`theme.${option.value}`) }}</span>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <template v-if="option.icon === 'system'">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </template>
        <template v-else-if="option.icon === 'light'">
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        </template>
        <path v-else d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.theme-switch {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface);
}

.theme-switch__option {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-muted);
  transition:
    background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    color: var(--color-text);
  }

  &[aria-pressed='true'] {
    background: var(--color-accent-fill);
    color: var(--color-on-accent);
  }
}
</style>
