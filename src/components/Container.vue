<template>
  <component :is="tag" class="container">
    <slot />
  </component>
</template>

<script setup lang="ts">
  const { tag = 'div' } = defineProps<{
    tag?: HTMLElement;
  }>();
</script>

<style lang="postcss">
  .container {
    max-width: var(--max-content-width);
    margin: 0 auto;
    padding-left: var(--gutter);
    padding-right: var(--gutter);
  }
</style>
