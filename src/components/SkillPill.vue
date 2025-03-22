<template>
  <div class="pill" :style="{ '--bg-color': bgColor, '--color': color }">
    <slot />
  </div>
</template>

<script setup lang="ts">
  const { bgColor, color = '#ffffff' } = defineProps<{
    bgColor: string;
    color?: string;
  }>();
</script>

<style lang="postcss">
  .pill {
    display: inline-block;
    padding: 8px 15px;
    background-color: var(--bg-color);
    color: var(--color);
    clip-path: var(--parallelogram-shape);
  }
</style>
