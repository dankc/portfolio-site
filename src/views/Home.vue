<template>
  <main class="main">
    <Hero :data="sectionData.heroData" />
    <NpmContributions :data="sectionData.packagesData" />
    <Features :data="sectionData.servicesData" />
    <WorksView :data="sectionData.workData" />
    <AboutView :data="sectionData.aboutData" />
  </main>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useMeta } from '@/composables/useMeta.ts';
  import { useContentStore } from '@/stores/content.ts';
  import AboutView from '@/components/sections/About.vue';
  import NpmContributions from '@/components/sections/FeaturedProject.vue';
  import Hero from '@/components/sections/Hero.vue';
  import WorksView from '@/components/sections/Samples.vue';
  import Features from '@/components/sections/Services.vue';

  const { path } = useRoute();
  const { getContentfulPage } = useContentStore();
  const { setMeta } = useMeta();
  setMeta({
    title: 'Dan Kiser | Sr. FE Dev',
  });
  const delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  await delay(10000);
  const { data, error } = await getContentfulPage(path);
  const sectionData = computed(() => {
    return {
      heroData: data.value?.body.find((entry) => entry.sectionId === 'homeHero'),
      packagesData: data.value?.body.find((entry) => entry.sectionId === 'featuredPackages'),
      servicesData: data.value?.body.find((entry) => entry.sectionId === 'services'),
      workData: data.value?.body.find((entry) => entry.sectionId === 'workSamples'),
      aboutData: data.value?.body.find((entry) => entry.sectionId === 'about'),
    };
  });

  if (error.value) {
    throw Error(error.value);
  }
</script>
