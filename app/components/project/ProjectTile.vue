<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

// A compact project card for the home page: picture, name, date and summary.
// Everything else is one click away on the project page.
const props = defineProps<{ project: Project }>()

const { pick } = useLocalized()
const localePath = useLocalePath()

const pagePath = computed(() => localePath(`/projects/${props.project.slug}`))
const headingId = computed(() => `tile-${props.project.slug}`)
</script>

<template>
  <article class="tile" :aria-labelledby="headingId">
    <NuxtLink :to="pagePath" class="tile__media" tabindex="-1" aria-hidden="true">
      <ProjectMedia :project="project" sizes="320:100vw 640:40vw 1024:362px" />
    </NuxtLink>
    <div class="tile__body">
      <h3 :id="headingId" class="tile__name">
        <NuxtLink :to="pagePath" class="tile__link">{{ project.name }}</NuxtLink>
      </h3>
      <ProjectMeta :project="project" />
      <p class="tile__summary">{{ pick(project.summary) }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.tile {
  display: grid;
  gap: var(--space-4);

  // Side by side on tablets, stacked again in the three-column grid
  @include from(sm) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: var(--space-6);
    align-items: start;
  }

  @include from(lg) {
    grid-template-columns: none;
    gap: var(--space-4);
  }
}

.tile__media {
  display: block;
  // Wraps the terminal block too, which must not inherit link underlines
  text-decoration: none;
  color: inherit;
  border-radius: var(--radius-md);
  transition: opacity var(--duration-fast) var(--ease-out);

  &:hover {
    opacity: 0.92;
  }
}

.tile__body {
  display: grid;
  gap: var(--space-2);
}

.tile__name {
  font-size: var(--text-lg);
  letter-spacing: -0.015em;
}

.tile__link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }
}

.tile__summary {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--text-base);
}
</style>
