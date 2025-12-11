<template>
  <section class="hero" id="hero">
    <Container class="hero__inner">
      <div class="hero__copy-container">
        <h1 class="hero__heading">{{ data.heading }}</h1>
        <p class="hero__paragraph">{{ data.paragraph }}</p>
        <div>
          <a
            v-for="({ url, text, trackingTag }, key) in data.buttons"
            :key
            class="hero__button button"
            :href="url"
            @click="track(trackingTag || text)"
          >
            {{ text }}
          </a>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useMatomo } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  import Container from '@/components/Container.vue';
  import type { IHeroFields } from '@/types/contentful';

  const { data } = defineProps<{
    data: IHeroFields;
  }>();

  const matomo = useMatomo();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());
  const track = (tag: string) => {
    if (!isUserOptedOut.value) matomo.value?.trackEvent('Button', 'Click', tag);
  };
</script>

<style lang="postcss">
  .hero {
    position: relative;
    background: var(--red-bold);

    @media (min-width: 400px) {
      background: linear-gradient(90deg, var(--red-bold) 50%, transparent 50%);
      clip-path: var(--angle-shape);
    }

    &__copy-container {
      flex: 0 100%;
      padding: var(--gutter) 0;
      background: var(--red-bold);

      @media (min-width: 400px) {
        flex: 0 round(nearest, calc(60% + 40px), 1px);
        padding-right: var(--angle-depth);
        clip-path: var(--angle-shape);
      }
    }

    &__heading {
      margin-bottom: 1.5rem;
      position: relative;
      color: var(--white);
      font-family: var(--f-mono);
      font-size: clamp(5rem, 20vw, 6rem);
      line-height: 1;
    }

    &__paragraph {
      margin: 1.25rem 0;
      font-family: var(--f-sans);
      font-size: 1.2rem;
    }

    &__button {
      background-color: var(--green-bold);

      &:hover {
        background-color: var(--blue-bold);
        color: var(--white);
      }
    }

    &__inner {
      display: flex;
      position: relative;
    }
  }
</style>
