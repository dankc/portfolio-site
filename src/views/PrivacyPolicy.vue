<template>
  <section class="privacy-policy">
    <h2 class="privacy-policy__h2">{{ heading }}</h2>
    <template v-for="({ heading, paragraph, list, optOutButton }, index) in sections" :key="index">
      <h3 class="privacy-policy__h3">{{ heading }}</h3>
      <p class="privacy-policy__paragraph" v-html="parseLinks(paragraph)"></p>
      <ul v-if="list" class="privacy-policy__list">
        <li v-for="(item, key) in list" :key>
          {{ item }}
        </li>
      </ul>
      <button v-if="optOutButton" class="privacy-policy__opt-out button" @click.prevent="optOut">{{ optOutButton }}</button>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useMatomo } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import { useParsePlaceholders } from '@/composables/useParsePlaceholders.ts';
  import { heading, sections } from '@/data/privacy-policy.json';

  const matomo = useMatomo();
  const { setMeta } = useMeta();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());
  const { parseLinks } = useParsePlaceholders();
  const optOut = () => {
    matomo.value?.optUserOut();
    isUserOptedOut.value = true;
  };

  setMeta({
    title: 'Privacy Policy | kiser.codes',
  });
</script>

<style lang="postcss">
  .privacy-policy {
    max-width: calc(820px + var(--gutter));
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    margin: 0 auto;
    padding: 4rem var(--gutter) 0;

    &__h2,
    &__h3 {
      font-family: var(--f-mono);
      font-weight: 700;
      color: var(--white);
      text-transform: uppercase;
    }

    &__h2 {
      margin-bottom: 2.5rem;
      font-size: 2.625rem;
    }

    &__h3 {
      margin-top: 2.5rem;
      font-size: 2rem;
    }

    &__paragraph,
    &__list {
      margin: 1.5rem auto;
    }

    &__opt-out {
      background-color: var(--green-bold);
    }
  }
</style>
