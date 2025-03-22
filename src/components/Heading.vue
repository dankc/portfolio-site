<template>
  <div>
    <div class="eyebrow" v-if="eyebrow">
      <slot name="eyebrow">{{ eyebrow }}</slot>
    </div>
    <component :is="tag">
      <slot />
    </component>
  </div>
</template>

<script setup lang="ts">
  const { tag = 'h2' } = defineProps<{
    tag?: HTMLElement;
    eyebrow?: Text;
  }>();
</script>
