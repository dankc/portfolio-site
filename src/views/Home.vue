<template>
  <main class="main">
    <Hero />
    <NpmContributions />
    <Features />
    <WorksView />
    <AboutView />
  </main>
</template>

<script setup lang="ts">
  import { useMeta } from '@/composables/useMeta.ts';
  import AboutView from '@/views/About.vue';
  import NpmContributions from '@/views/FeaturedProject.vue';
  import Hero from '@/views/Hero.vue';
  import WorksView from '@/views/Samples.vue';
  import Features from '@/views/Services.vue';

  const { setMeta } = useMeta();
  setMeta({
    title: 'Dan Kiser | Sr. FE Dev',
  });
</script>
