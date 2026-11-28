<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{ project: Project; headingLevel?: 2 | 3 }>()

const { t } = useI18n()
const { pick } = useLocalized()
const localePath = useLocalePath()

const heading = computed(() => `h${props.headingLevel ?? 2}`)
const headingId = computed(() => `project-${props.project.slug}`)
const pagePath = computed(() => localePath(`/projects/${props.project.slug}`))
</script>

<template>
  <article class="project" :aria-labelledby="headingId">
    <!-- The picture repeats the title link for pointer users; keyboard and
         screen reader users get the title link only -->
    <NuxtLink :to="pagePath" class="project__media" tabindex="-1" aria-hidden="true">
      <ProjectMedia :project="project" sizes="640:100vw 768:45vw 1280:520px" />
    </NuxtLink>

    <div class="project__body">
      <header class="project__header">
        <component :is="heading" :id="headingId" class="project__name">
          <NuxtLink :to="pagePath" class="project__name-link">{{ project.name }}</NuxtLink>
        </component>
        <ProjectMeta :project="project" />
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

.project__media {
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

.project__name-link {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
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
