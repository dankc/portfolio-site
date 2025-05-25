<template>
  <Nav ref="global-nav" :class="{ 'modal-open': isModalOpen }" />
  <Suspense>
    <router-view
      :class="{ 'modal-open': isModalOpen }"
      :style="{ '--header-height': `${headerHeight}px`, '--footer-height': `${footerHeight}px` }"
    />
    <template #fallback>
      <div class="loading" style="min-height: 90vh; font-size: 48px; color: chartreuse">Loading...</div>
    </template>
  </Suspense>
  <div v-if="fetchError" class="error">
    {{ fetchError }}
    <button @click="retryFetch">Retry</button>
  </div>
  <Footer ref="global-footer" :class="{ 'modal-open': isModalOpen }" />
</template>

<script setup lang="ts">
  import { ref, useTemplateRef, onMounted, onErrorCaptured, type ComponentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global';
  import { useElementHeight } from '@/composables/useElementHeight.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import MetaTags from '@/data/meta-tags.json';
  import Nav from '@/components/Nav.vue';
  import Footer from '@/components/Footer.vue';

  const { push, currentRoute } = useRouter();
  const { isModalOpen, headerHeight, footerHeight } = storeToRefs(useGlobalStore());
  const { setMeta } = useMeta();
  setMeta({
    ...MetaTags,
  });

  const fetchError = ref<string | null>(null);
  const retryFetch = () => {
    fetchError.value = null;
    push(currentRoute.value.path);
  };

  const globalNav = useTemplateRef('global-nav');
  const globalFooter = useTemplateRef('global-footer');

  onMounted(() => {
    headerHeight.value = useElementHeight((globalNav.value as ComponentInstance<HTMLElement>).$el);
    footerHeight.value = useElementHeight((globalFooter.value as ComponentInstance<HTMLElement>).$el);
  });

  onErrorCaptured((error, vm, info) => {
    fetchError.value = error.message || 'An error occurred while fetching page data';
    console.error('Error captured:', error);
    console.error('Vue component:', vm);
    console.error('Error info:', info);
    return false;
  });
</script>

<style scoped lang="postcss">
  .error {
    color: red;
    padding: 1rem;
    text-align: center;
  }
</style>
