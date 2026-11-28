<script setup lang="ts">
// Stands in for a screenshot when a project has no user interface: the
// commands you would actually type to run it.
// `compact` drops the 16:10 frame that lines the block up with screenshots
// in the list; on a project page the commands only take the room they need.
defineProps<{ lines: string[]; label: string; compact?: boolean }>()
</script>

<template>
  <figure class="terminal" :class="{ 'terminal--compact': compact }">
    <pre class="terminal__body"><code><span
      v-for="(line, l) in lines"
      :key="l"
      class="terminal__line"
    ><template v-for="(token, i) in line.split(' ')" :key="i"><span class="terminal__token">{{ token }}</span>{{ i < line.split(' ').length - 1 ? ' ' : '' }}</template></span></code></pre>
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

.terminal--compact {
  aspect-ratio: auto;
  padding: var(--space-8);

  .terminal__body {
    font-size: var(--text-base);
  }
}

.terminal__body {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.9;
  white-space: pre-wrap;
  // Wrap at spaces; break inside a word only when it can't fit at all
  overflow-wrap: break-word;
}

.terminal__token {
  // Lines wrap only between words: never inside game-tun.json at its hyphen
  white-space: nowrap;
}

.terminal__line {
  display: block;
  // Hanging indent: a wrapped command continues under the command, not the $
  padding-left: 2ch;
  text-indent: -2ch;

  &::before {
    content: '$ ';
    color: var(--color-terminal-prompt);
    user-select: none;
  }
}
</style>
