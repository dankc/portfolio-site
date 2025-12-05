<template>
  <article class="react-app" ref="reactApp"></article>
</template>

<script setup lang="ts">
  import { useTemplateRef, onMounted, onUnmounted } from 'vue';

  const reactContainer = useTemplateRef('reactApp');
  let unmount: () => void;

  onMounted(async () => {
    const ReactComponent = await import('react_app/App');

    ReactComponent.mount(reactContainer.value);

    unmount = () => ReactComponent.unmount();
  });

  onUnmounted(() => {
    unmount();
  });
</script>
