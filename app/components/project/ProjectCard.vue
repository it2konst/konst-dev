<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{ project: Project; headingLevel?: 2 | 3 }>()

const { t } = useI18n()
const { pick, formatMonth } = useLocalized()

const heading = computed(() => `h${props.headingLevel ?? 2}`)
const headingId = computed(() => `project-${props.project.slug}`)
const statusLabel = computed(() =>
  props.project.status === 'live' ? null : t(`projects.status.${props.project.status}`),
)
</script>

<template>
  <article class="project" :aria-labelledby="headingId">
    <div class="project__media">
      <img
        v-if="project.cover"
        class="project__cover"
        :src="project.cover.src"
        :alt="pick(project.cover.alt)"
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
      />
      <ProjectTerminal
        v-else-if="project.terminal"
        :lines="project.terminal"
        :label="t('projects.terminalLabel', { name: project.name })"
      />
    </div>

    <div class="project__body">
      <header class="project__header">
        <component :is="heading" :id="headingId" class="project__name">
          {{ project.name }}
        </component>
        <p class="project__meta">
          <time :datetime="project.date">{{ formatMonth(project.date) }}</time>
          <span v-if="statusLabel" class="project__status">{{ statusLabel }}</span>
        </p>
      </header>

      <p class="project__summary">{{ pick(project.summary) }}</p>

      <ProjectStackTags :stack="project.stack" />

      <ul role="list" class="project__links">
        <li v-if="project.links.demo">
          <a
            :href="project.links.demo"
            class="project__link project__link--primary"
            :aria-label="`${t('projects.demo')}: ${project.name}`"
            >{{ t('projects.demo') }}</a
          >
        </li>
        <li>
          <a
            :href="project.links.repo"
            class="project__link"
            :aria-label="`${t('projects.repo')}: ${project.name}`"
            >{{ t('projects.repo') }}</a
          >
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped lang="scss">
.project {
  display: grid;
  gap: var(--space-6);

  @include from(md) {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: var(--space-12);
    align-items: start;
  }
}

.project__cover {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-surface);
}

.project__body {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}

.project__header {
  display: grid;
  gap: var(--space-1);
}

.project__name {
  font-size: var(--text-xl);
  letter-spacing: -0.02em;

  @include from(md) {
    font-size: var(--text-2xl);
  }
}

.project__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

// Text label plus the LED: a project that is still being built is "blinking"
.project__status {
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

.project__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-6);
  margin-top: var(--space-1);
}

.project__link {
  font-weight: var(--weight-semibold);
  text-decoration-color: var(--color-border);

  &:hover {
    text-decoration-color: var(--color-accent);
  }
}

.project__link--primary {
  text-decoration-color: var(--color-accent);
}
</style>
