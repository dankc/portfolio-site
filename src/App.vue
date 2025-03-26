<template>
  <Nav ref="global-nav" :class="{ 'modal-open': isModalOpen }" />
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
  import { inject, ref, useTemplateRef, onMounted, type ComponentInstance, type Ref } from 'vue';
  import { matomoKey } from 'vue-matomo';
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

  const matomo = inject<Ref>(matomoKey);
  const { isModalOpen } = storeToRefs(useGlobalStore());
  const { getHeaderHeight } = useHeaderHeight();
  const { setMeta } = useMeta();
  setMeta({
    author: 'Dan Kiser',
    description: 'Portfolio website of Dan Kiser, Senior Front-End Developer',
    keywords: 'Senior Front-End Developer, Senior Front-End Engineer, Web Developer',
    title: 'Dan Kiser | Sr. FE Dev',
    // Social tags
    'og:locale': 'en-us',
    'og:description': 'Portfolio website of Dan Kiser, Senior Front-End Developer',
    'og:title': 'Dan Kiser | Sr. FE Dev',
    'og:url': 'https://kiser.codes',
    'og:image': '/static/img/rotated-dk-monogram-og-img.png',
    'og:type': 'website',
    'twitter:domain': 'kiser.codes',
    'twitter:url': 'https://kiser.codes',
    'twitter:title': 'Dan Kiser | Sr. FE Dev',
    'twitter:description': 'Portfolio website of Dan Kiser, Senior Front-End Developer',
    'twitter:image': '/static/img/rotated-dk-monogram-og-img.png',
  });

  const globalNav = useTemplateRef('global-nav');
  const headerHeight = ref<number | undefined>();

  onMounted(() => {
    headerHeight.value =
      getHeaderHeight((globalNav.value as ComponentInstance<HTMLElement>).$el) || 0;
    // Ugly but temporary - need to add event to forked package
    setTimeout(() => matomo?.value?.trackPageView('Home Page'), 500);
  });
</script>
