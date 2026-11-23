<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

// The project's picture: the screenshot, or the terminal block for projects
// without a user interface. `sizes` follows @nuxt/image: each width applies
// up to the next breakpoint.
withDefaults(
  defineProps<{
    project: Project
    sizes: string
    eager?: boolean
    compact?: boolean
  }>(),
  { eager: false, compact: false },
)

const { t } = useI18n()
const { pick } = useLocalized()
</script>

<template>
  <NuxtPicture
    v-if="project.cover"
    :src="project.cover.src"
    :alt="pick(project.cover.alt)"
    width="1440"
    height="900"
    :sizes="sizes"
    legacy-format="webp"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
    :img-attrs="{ class: 'project-media__cover' }"
  />
  <ProjectTerminal
    v-else-if="project.terminal"
    :lines="project.terminal"
    :label="t('projects.terminalLabel', { name: project.name })"
    :compact="compact"
  />
</template>

<style scoped lang="scss">
// The <img> is rendered inside NuxtPicture, so scoped styles need :deep()
:deep(.project-media__cover) {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-surface);
}
</style>
