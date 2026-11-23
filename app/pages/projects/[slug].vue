<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const { pick } = useLocalized()
const localePath = useLocalePath()

// All projects come in one small payload; the neighbours for the
// previous / next links come from the same list.
const { data: projects } = await useProjects()

const index = computed(() => projects.value.findIndex((p) => p.slug === String(route.params.slug)))
const project = computed(() => projects.value[index.value])

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const previous = computed(() => projects.value[index.value - 1])
const next = computed(() => projects.value[index.value + 1])

useHead({ title: () => project.value?.name })
useSeoMeta({
  description: () => (project.value ? pick(project.value.summary) : undefined),
})
</script>

<template>
  <article v-if="project" class="container project-page" aria-labelledby="project-title">
    <NuxtLink :to="localePath('/projects')" class="project-page__back">
      {{ t('project.back') }}
    </NuxtLink>

    <header class="project-page__header">
      <h1 id="project-title" class="project-page__title">{{ project.name }}</h1>
      <ProjectMeta :project="project" />
      <p class="project-page__summary">{{ pick(project.summary) }}</p>
      <div class="project-page__actions">
        <a v-if="project.links.demo" :href="project.links.demo" class="button button--primary">
          {{ t('projects.demo') }}
        </a>
        <a :href="project.links.repo" class="button button--quiet">{{ t('projects.repo') }}</a>
      </div>
    </header>

    <div class="project-page__media">
      <ProjectMedia :project="project" sizes="640:100vw 1280:1152px" eager compact />
    </div>

    <div class="project-page__details">
      <section aria-labelledby="inside-title">
        <h2 id="inside-title" class="project-page__h2">{{ t('project.inside') }}</h2>
        <ul role="list" class="highlights">
          <li v-for="item in pick(project.highlights)" :key="item" class="highlights__item">
            {{ item }}
          </li>
        </ul>
      </section>

      <aside aria-labelledby="stack-title" class="project-page__aside">
        <h2 id="stack-title" class="project-page__h2">{{ t('project.stack') }}</h2>
        <ProjectStackTags :stack="project.stack" linked />
      </aside>
    </div>

    <nav v-if="previous || next" class="pager" :aria-label="t('project.pagerLabel')">
      <NuxtLink
        v-if="previous"
        :to="localePath(`/projects/${previous.slug}`)"
        class="pager__link"
        rel="prev"
      >
        <span class="pager__label">{{ t('project.newer') }}</span>
        <span class="pager__name">{{ previous.name }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="next"
        :to="localePath(`/projects/${next.slug}`)"
        class="pager__link pager__link--next"
        rel="next"
      >
        <span class="pager__label">{{ t('project.older') }}</span>
        <span class="pager__name">{{ next.name }}</span>
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped lang="scss">
.project-page {
  display: grid;
  gap: var(--space-8);
}

.project-page__back {
  justify-self: start;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-decoration-color: var(--color-border);

  &::before {
    content: '\2190\00a0';
  }

  &:hover {
    color: var(--color-text);
  }
}

.project-page__header {
  display: grid;
  gap: var(--space-4);
}

.project-page__title {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.project-page__summary {
  font-size: var(--text-md);
  max-width: 60ch;

  @include from(md) {
    font-size: var(--text-lg);
    line-height: 1.5;
  }
}

.project-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.project-page__details {
  display: grid;
  gap: var(--space-12);
  margin-top: var(--space-4);

  @include from(md) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: var(--space-16);
  }
}

.project-page__h2 {
  margin-bottom: var(--space-6);
  font-size: var(--text-lg);
}

.highlights {
  display: grid;
  gap: var(--space-4);
}

// The LED square again: each point is a lit indicator
.highlights__item {
  position: relative;
  padding-left: var(--space-6);
  max-width: var(--measure);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 2px;
    background: var(--color-accent-fill);
  }
}

.pager {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-8);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-subtle);

  @include from(sm) {
    grid-template-columns: 1fr 1fr;
  }
}

.pager__link {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: border-color var(--duration-fast) var(--ease-out);

  &:hover {
    border-color: var(--color-accent);
  }
}

.pager__link--next {
  text-align: right;

  @include from(sm) {
    grid-column: 2;
  }
}

.pager__label {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.pager__name {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
}
</style>
