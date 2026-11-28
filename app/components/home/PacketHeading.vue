<script setup lang="ts">
// The one moment of motion on the site: the headline's letters arrive out
// of order and settle into place, like datagrams over UDP. Pure CSS, so it
// plays before any script loads; with reduced motion the text just appears.
const props = defineProps<{ text: string; id?: string }>()

const words = computed(() => packetText(props.text))
</script>

<template>
  <h1 :id="id" class="packet-heading">
    <span class="visually-hidden">{{ text }}</span>
    <span class="packet-heading__visual" aria-hidden="true">
      <template v-for="(word, w) in words" :key="w">
        <span class="packet-heading__word">
          <span
            v-for="(item, c) in word"
            :key="c"
            class="packet-heading__char"
            :style="{ '--delay': `${item.delay}ms` }"
            >{{ item.char }}</span
          >
        </span>
        {{ ' ' }}
      </template>
    </span>
  </h1>
</template>

<style scoped lang="scss">
.packet-heading__word {
  display: inline-block;
  white-space: nowrap;
}

.packet-heading__char {
  display: inline-block;
}

@media (prefers-reduced-motion: no-preference) {
  .packet-heading__char {
    animation: packet-arrive 300ms var(--ease-out) both;
    animation-delay: var(--delay);
  }
}

@keyframes packet-arrive {
  from {
    opacity: 0;
    transform: translateY(0.35em);
    color: var(--color-accent);
  }

  60% {
    opacity: 1;
    color: var(--color-accent);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>
