<template>
  <slot />
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from 'vue';

  const {
    target,
    callback,
    options = { threshold: 0.5, rootMargin: '10%' },
  } = defineProps<{
    target: () => Element;
    callback: IntersectionObserverCallback;
    options?: IntersectionObserverInit;
  }>();

  const io = new IntersectionObserver(callback, options);

  onMounted(() => {
    io.observe(target());
  });
  onBeforeUnmount(() => {
    io.disconnect();
  });
</script>
