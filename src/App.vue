<template>
  <Nav ref="global-nav" :class="{ 'modal-open': isModalOpen }" />
  <router-view
    :class="{ 'modal-open': isModalOpen }"
    :style="{ '--header-height': `${headerHeight}px`, '--footer-height': `${footerHeight}px` }"
  />
  <Footer ref="global-footer" :class="{ 'modal-open': isModalOpen }" />
</template>

<script setup lang="ts">
  import { useTemplateRef, onMounted, type ComponentInstance } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global';
  import { useElementHeight } from '@/composables/useElementHeight.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import MetaTags from '@/data/meta-tags.json';
  import Nav from '@/components/Nav.vue';
  import Footer from '@/components/Footer.vue';

  const { isModalOpen, headerHeight, footerHeight } = storeToRefs(useGlobalStore());
  const { setMeta } = useMeta();
  setMeta({
    ...MetaTags,
  });

  const globalNav = useTemplateRef('global-nav');
  const globalFooter = useTemplateRef('global-footer');

  onMounted(() => {
    headerHeight.value = useElementHeight((globalNav.value as ComponentInstance<HTMLElement>).$el);
    footerHeight.value = useElementHeight((globalFooter.value as ComponentInstance<HTMLElement>).$el);
  });
</script>
