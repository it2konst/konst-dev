<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('projects.title') })

const { data: projects } = await useProjects()
</script>

<template>
  <div class="container">
    <section class="page-intro" aria-labelledby="projects-title">
      <h1 id="projects-title">{{ t('projects.title') }}</h1>
      <p class="page-intro__lead">{{ t('projects.lead') }}</p>
    </section>

    <ol v-if="projects.length" role="list" class="project-list">
      <li v-for="project in projects" :key="project.slug" class="project-list__item">
        <ProjectCard :project="project" />
      </li>
    </ol>
    <p v-else class="page-intro__note">{{ t('projects.empty') }}</p>
  </div>
</template>

<style scoped lang="scss">
.project-list {
  margin-top: var(--space-12);
}

.project-list__item {
  padding-block: var(--space-12);
  border-top: 1px solid var(--color-border-subtle);

  &:first-child {
    padding-top: var(--space-8);
  }
}
</style>
