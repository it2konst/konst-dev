<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__copy">© {{ year }} {{ t('site.name') }}</p>
      <ul role="list" class="footer__links">
        <li>
          <a href="https://github.com/it2konst" rel="me">{{ t('footer.github') }}</a>
        </li>
        <li>
          <a href="https://github.com/it2konst/konst-dev">{{ t('footer.source') }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border-subtle);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3) var(--space-6);
  padding-block: var(--space-6);
}

.footer__links {
  display: flex;
  gap: var(--space-6);

  a {
    text-decoration-color: var(--color-border);

    &:hover {
      color: var(--color-text);
      text-decoration-color: var(--color-accent);
    }
  }
}
</style>
