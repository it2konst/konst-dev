<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// A section stays highlighted on its inner pages too: /projects/svg-forge
// is a sibling route of /projects for the router, so its own active class
// does not cover it
function isCurrentSection(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const links = computed(() => [
  { to: localePath('/projects'), label: t('nav.projects') },
  { to: localePath('/about'), label: t('nav.about') },
])
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <NuxtLink :to="localePath('/')" class="brand" :aria-label="t('a11y.home')">
        <span class="brand__led" aria-hidden="true" />
        <span class="brand__name">{{ t('site.name') }}</span>
      </NuxtLink>

      <nav class="nav" :aria-label="t('a11y.mainNav')">
        <ul role="list" class="nav__list">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="nav__link"
              :class="{ 'nav__link--current': isCurrentSection(link.to) }"
              >{{ link.label }}</NuxtLink
            >
          </li>
        </ul>
      </nav>

      <div class="header__controls">
        <UiLocaleSwitch />
        <!-- The saved theme is only known in the browser, so the switch renders
             there; a same-size placeholder keeps the header from shifting -->
        <ClientOnly>
          <UiThemeSwitch />
          <template #fallback>
            <span class="theme-placeholder" aria-hidden="true" />
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid var(--color-border-subtle);
}

.header__inner {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'brand controls'
    'nav nav';
  align-items: center;
  gap: var(--space-3) var(--space-6);
  padding-block: var(--space-4);

  @include from(sm) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'brand nav controls';
  }
}

.brand {
  grid-area: brand;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  justify-self: start;
  font-weight: var(--weight-semibold);
  font-size: var(--text-md);
  letter-spacing: -0.01em;
  text-decoration: none;
}

// A status LED, like on a network switch port: the one bit of colour
// in the header, and it doubles as the favicon later on
.brand__led {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 2px;
  background: var(--color-accent-fill);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-fill) 22%, transparent);
}

.nav {
  grid-area: nav;
}

.nav__list {
  display: flex;
  gap: var(--space-6);
}

.nav__link {
  display: inline-block;
  padding-block: var(--space-1);
  color: var(--color-text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-text);
  }

  &--current {
    color: var(--color-text);
    border-bottom-color: var(--color-accent-fill);
  }
}

.header__controls {
  grid-area: controls;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.theme-placeholder {
  display: block;
  width: 6.625rem;
  height: 2.375rem;
}
</style>
