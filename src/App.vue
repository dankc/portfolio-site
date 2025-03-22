<template>
  <Nav ref="global-nav" />
  <main
    class="main"
    :class="{ 'modal-open': isModalOpen }"
    :style="{ '--header-height': `${headerHeight}px` }"
  >
    <Hero />
    <NpmContributions />
    <Features />
    <WorksView />
    <AboutView />
  </main>
  <Footer />
</template>

<script setup lang="ts">
  import { ref, useTemplateRef, onMounted, type ComponentInstance } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global';
  import { useHeaderHeight } from '@/composables/useHeaderHeight.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import Footer from '@/components/Footer.vue';
  import Nav from '@/components/Nav.vue';
  import AboutView from '@/views/About.vue';
  import NpmContributions from '@/views/FeaturedProject.vue';
  import Hero from '@/views/Hero.vue';
  import WorksView from '@/views/Samples.vue';
  import Features from '@/views/Services.vue';

  const { isModalOpen } = storeToRefs(useGlobalStore());
  const { getHeaderHeight } = useHeaderHeight();
  const { setMeta } = useMeta();
  setMeta({
    author: 'Dan Kiser',
    description: 'Portfolio website of Dan Kiser, Senior Front-End Developer',
    keywords: 'Senior Front-End Developer, Senior Front-End Engineer, Web Developer',
    title: 'Dan Kiser | Sr. FE Dev',
    image: 'static/img/dk-monogram-bg.svg',
  });

  const globalNav = useTemplateRef('global-nav');
  const headerHeight = ref<number | undefined>();

  onMounted(() => {
    headerHeight.value =
      getHeaderHeight((globalNav.value as ComponentInstance<HTMLElement>).$el) || 0;
  });
</script>
