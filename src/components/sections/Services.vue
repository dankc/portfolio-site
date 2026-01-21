<template>
  <IntersectionObserver :callback="farIoCallback" :options="{ threshold: 0.25, rootMargin: '0%' }" :target="() => servicesRef">
    <IntersectionObserver :callback="closeIoCallback" :target="() => servicesRef">
      <section class="services hidden-section" id="services" ref="servicesRef">
        <Container>
          <h2 class="services__heading">{{ data.heading }}</h2>
          <ul class="services__list">
            <li v-for="(item, key) in data.list" :key>{{ item }}</li>
          </ul>
        </Container>
      </section>
    </IntersectionObserver>
  </IntersectionObserver>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useMatomo } from 'vue3-matomo';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global.ts';
  import Container from '@/components/Container.vue';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';
  import type { IDetailsFields } from '@/types/contentful-generated-types';

  const { data } = defineProps<{
    data: IDetailsFields;
  }>();

  const servicesRef = ref();
  const matomo = useMatomo();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());
  const { changeActiveSection } = useGlobalStore();

  const closeIoCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) {
        changeActiveSection('services');
        if (!isUserOptedOut.value) matomo.value?.trackEvent('Section Viewed', 'Services');
      }
    });
  };

  const farIoCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach(({ isIntersecting }) => {
      if (isIntersecting) {
        servicesRef.value.classList.remove('hidden-section');
      }
    });
  };
</script>

<style lang="postcss">
  .services {
    margin: calc(var(--section-gap) / 2) 0;
    transition: all 0.3s ease-out;
  }

  .services__heading {
    margin-bottom: 1.5rem;
    font-family: var(--f-mono);
    font-size: 2.625rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .services__list {
    padding: 0;
    list-style: none;
    color: var(--black);

    @media (min-width: 1024px) {
      column-count: 2;
      column-gap: 1.5rem;
    }

    li {
      margin-bottom: 1.25rem;
      padding: 0.5rem 3rem;
      background-color: var(--yellow);
      /*background-color: rgb(from var(--yellow) r g b / 80%);*/
      clip-path: var(--parallelogram-shape);
      font-size: 1.25rem;
    }
  }
</style>
