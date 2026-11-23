<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{ project: Pick<Project, 'date' | 'status'> }>()

const { t } = useI18n()
const { formatMonth } = useLocalized()

const statusLabel = computed(() =>
  props.project.status === 'live' ? null : t(`projects.status.${props.project.status}`),
)
</script>

<template>
  <p class="project-meta">
    <time :datetime="project.date">{{ formatMonth(project.date) }}</time>
    <span v-if="statusLabel" class="project-meta__status">{{ statusLabel }}</span>
  </p>
</template>

<style scoped lang="scss">
.project-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

// A label plus the LED square from the header: the project is still running
.project-meta__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text);

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 2px;
    background: var(--color-accent-fill);
  }
}
</style>
