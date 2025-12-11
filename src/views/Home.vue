<template>
  <main class="main">
    <Hero :data="sectionData.heroData" />
    <FeaturedPackages :data="sectionData.packagesData" />
    <Features :data="sectionData.servicesData" />
    <WorksView :data="sectionData.workData" />
    <AboutView :data="sectionData.aboutData" />
  </main>
</template>

<script setup lang="ts">
  import type { HomePage, HomePageData } from '@/types/home-content';
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useMeta } from '@/composables/useMeta.ts';
  import { useContentStore } from '@/stores/content.ts';
  import {
    transformPageData,
    isHeroFields,
    isFeaturedPackages,
    isSampleSection,
    isServicesSection,
    isAboutSection,
    type SectionMapping,
  } from '@/utils/verify-page-data.ts';
  import AboutView from '@/components/sections/About.vue';
  import FeaturedPackages from '@/components/sections/FeaturedPackages.vue';
  import Hero from '@/components/sections/Hero.vue';
  import WorksView from '@/components/sections/Samples.vue';
  import Features from '@/components/sections/Services.vue';

  const { path, hash } = useRoute();
  const { getContentfulPage } = useContentStore();
  const { setMeta } = useMeta();
  setMeta({
    title: 'Dan Kiser | Sr. FE Dev',
  });

  const { data, error } = await getContentfulPage<HomePage>(path);
  const sectionMapping: SectionMapping<HomePageData> = {
    heroData: { sectionId: 'homeHero', typeGuard: isHeroFields },
    packagesData: { sectionId: 'featuredPackages', typeGuard: isFeaturedPackages },
    servicesData: { sectionId: 'services', typeGuard: isServicesSection },
    workData: { sectionId: 'workSamples', typeGuard: isSampleSection },
    aboutData: { sectionId: 'about', typeGuard: isAboutSection },
  };

  const sectionData = transformPageData<HomePage, HomePageData>(data, sectionMapping);

  if (error.value) {
    throw Error(error.value);
  }

  onMounted(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView();
    }
  });

</script>
