<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useHead({ title: () => t('home.title') })

const { data: projects } = await useProjects()
const featured = computed(() => projects.value.filter((project) => project.featured))

const areas = computed(() => [
  {
    id: 'frontend',
    title: t('home.areas.frontend.title'),
    text: t('home.areas.frontend.text'),
    link: t('home.areas.frontend.link'),
    stack: 'vue',
  },
  {
    id: 'network',
    title: t('home.areas.network.title'),
    text: t('home.areas.network.text'),
    link: t('home.areas.network.link'),
    stack: 'go',
  },
])
</script>

<template>
  <div class="container home">
    <section class="hero" aria-labelledby="hero-title">
      <HomePacketHeading id="hero-title" class="hero__title" :text="t('home.greeting')" />
      <p class="hero__role">{{ t('home.title') }}</p>
      <p class="hero__lead">{{ t('home.lead') }}</p>
      <div class="hero__actions">
        <NuxtLink :to="localePath('/projects')" class="button button--primary">
          {{ t('home.seeProjects') }}
        </NuxtLink>
        <a href="https://github.com/it2konst" class="button button--quiet" rel="me">
          {{ t('home.github') }}
        </a>
      </div>
    </section>

    <section v-if="featured.length" class="home__section" aria-labelledby="featured-title">
      <div class="home__section-head">
        <h2 id="featured-title">{{ t('home.featured') }}</h2>
        <NuxtLink :to="localePath('/projects')" class="home__more">
          {{ t('home.allProjects', { count: projects.length }) }}
        </NuxtLink>
      </div>
      <ul role="list" class="featured">
        <li v-for="project in featured" :key="project.slug">
          <ProjectTile :project="project" />
        </li>
      </ul>
    </section>

    <section class="home__section" aria-labelledby="areas-title">
      <h2 id="areas-title">{{ t('home.areasTitle') }}</h2>
      <div class="areas">
        <article v-for="area in areas" :key="area.id" class="area" :data-area="area.id">
          <h3 class="area__title">{{ area.title }}</h3>
          <p>{{ area.text }}</p>
          <NuxtLink
            :to="localePath({ path: '/projects', query: { stack: area.stack } })"
            class="area__link"
            >{{ area.link }}</NuxtLink
          >
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  display: grid;
  gap: var(--space-24);
}

.hero {
  display: grid;
  gap: var(--space-6);
}

.hero__title {
  font-size: var(--text-display);
  font-weight: var(--weight-bold);
  letter-spacing: -0.03em;
  max-width: 14ch;
}

.hero__role {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
}

.hero__lead {
  font-size: var(--text-md);
  max-width: 52ch;

  @include from(md) {
    font-size: var(--text-lg);
    line-height: 1.5;
  }
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.home__section {
  display: grid;
  gap: var(--space-8);
  padding-top: var(--space-12);
  border-top: 1px solid var(--color-border-subtle);

  h2 {
    font-size: var(--text-2xl);
    letter-spacing: -0.02em;
  }
}

.home__section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2) var(--space-6);
}

.home__more {
  font-weight: var(--weight-semibold);
  text-decoration-color: var(--color-accent);
}

.featured {
  display: grid;
  gap: var(--space-12);

  @include from(lg) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-8);
  }
}

.areas {
  display: grid;
  gap: var(--space-12);

  @include from(md) {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
  }
}

.area {
  display: grid;
  gap: var(--space-3);
  align-content: start;
}

// Same LED square as everywhere else: one lit indicator per area
.area__title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xl);

  &::before {
    content: '';
    flex: none;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 2px;
    background: var(--color-accent-fill);
  }
}

.area__link {
  justify-self: start;
  font-weight: var(--weight-semibold);
  text-decoration-color: var(--color-accent);
}
</style>
