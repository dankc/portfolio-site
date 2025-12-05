<template>
  <article class="react-app" ref="reactApp"></article>
</template>

<script setup lang="ts">
  import { useTemplateRef, onMounted, onUnmounted } from 'vue';

  const reactContainer = useTemplateRef('reactApp');
  let unmount: () => void;

  onMounted(async () => {
    // @ts-expect-error this comes from federation and won't be available during a build
    const ReactComponent = await import('react_app/App');

    ReactComponent.mount(reactContainer.value);

    unmount = () => ReactComponent.unmount();
  });

  onUnmounted(() => {
    unmount();
  });
</script>
