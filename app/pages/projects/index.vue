<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

useHead({ title: () => t('projects.title') })

const { data: projects } = await useProjects()

const options = computed(() => stackOptions(projects.value))

// The page is pre-rendered without a filter, so ?stack= is read only after
// hydration; reading it during render would make the static HTML and the
// first client render disagree.
const selected = ref<StackId | null>(null)
onMounted(() => {
  selected.value = parseStackQuery(route.query.stack)
})
// Back and forward buttons, and tag links from a project page
watch(
  () => route.query.stack,
  (value) => {
    selected.value = parseStackQuery(value)
  },
)

function select(id: StackId | null) {
  selected.value = id
  // replace: trying filters should not fill the browser history
  router.replace({ query: id ? { ...route.query, stack: id } : {} })
}

const visible = computed(() => filterByStack(projects.value, selected.value))
const selectedLabel = computed(() => (selected.value ? STACK[selected.value].label : ''))
</script>

<template>
  <div class="container">
    <section class="page-intro" aria-labelledby="projects-title">
      <h1 id="projects-title">{{ t('projects.title') }}</h1>
      <p class="page-intro__lead">{{ t('projects.lead') }}</p>
    </section>

    <template v-if="projects.length">
      <ProjectStackFilter
        class="projects__filter"
        :model-value="selected"
        :options="options"
        :total="projects.length"
        @update:model-value="select"
      />

      <p class="visually-hidden" role="status">
        {{ t('filter.shown', { shown: visible.length, total: projects.length }) }}
      </p>

      <ol v-if="visible.length" role="list" class="project-list">
        <li v-for="project in visible" :key="project.slug" class="project-list__item">
          <ProjectCard :project="project" />
        </li>
      </ol>
      <div v-else class="page-intro__note projects__empty">
        <p>{{ t('filter.none', { tech: selectedLabel }) }}</p>
        <button type="button" class="button button--quiet" @click="select(null)">
          {{ t('filter.showAll') }}
        </button>
      </div>
    </template>
    <p v-else class="page-intro__note">{{ t('projects.empty') }}</p>
  </div>
</template>

<style scoped lang="scss">
.projects__filter {
  margin-top: var(--space-12);
}

.projects__empty {
  display: grid;
  gap: var(--space-4);
  justify-items: start;
}

.project-list {
  margin-top: var(--space-8);
}

.project-list__item {
  padding-block: var(--space-12);
  border-top: 1px solid var(--color-border-subtle);

  &:first-child {
    padding-top: var(--space-8);
  }
}
</style>
