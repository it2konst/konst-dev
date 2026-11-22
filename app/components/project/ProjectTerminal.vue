<script setup lang="ts">
// Stands in for a screenshot when a project has no user interface: the
// commands you would actually type to run it.
defineProps<{ lines: string[]; label: string }>()
</script>

<template>
  <figure class="terminal">
    <pre
      class="terminal__body"
    ><code><span v-for="line in lines" :key="line" class="terminal__line">{{ line }}</span></code></pre>
    <figcaption class="visually-hidden">{{ label }}</figcaption>
  </figure>
</template>

<style scoped lang="scss">
// Dark in both themes: it reads as a terminal, not as page content
.terminal {
  display: grid;
  align-content: center;
  aspect-ratio: 16 / 10;
  padding: var(--space-6);
  border: 1px solid var(--color-terminal-border);
  border-radius: var(--radius-md);
  background: var(--color-terminal-bg);
  color: var(--color-terminal-text);
  overflow: hidden;
}

.terminal__body {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.terminal__line {
  display: block;

  &::before {
    content: '$ ';
    color: var(--color-terminal-prompt);
    user-select: none;
  }
}
</style>
