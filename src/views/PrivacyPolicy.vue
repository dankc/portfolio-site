<template>
  <section class="privacy-policy">
    <h2 class="privacy-policy__h2">{{ data?.title }}</h2>
    <template v-for="({ heading, paragraphs, list }, index) in data?.body" :key="index">
      <h3 class="privacy-policy__h3">{{ heading }}</h3>
      <p
        class="privacy-policy__paragraph"
        v-for="(paragraph, index) in paragraphs"
        :key="index"
        v-html="parseLinks(paragraph)"
      ></p>
      <ul v-if="list" class="privacy-policy__list">
        <li v-for="(item, key) in list" :key>
          {{ item }}
        </li>
      </ul>
      <button v-if="heading.toLowerCase().includes('privacy')" class="privacy-policy__opt-out button" @click.prevent="optOut">
        Opt out of Anonymized Analytics
      </button>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useMatomo } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import { useParsePlaceholders } from '@/composables/useParsePlaceholders.ts';
  import { useContentStore } from '@/stores/content.ts';

  const { path } = useRoute();
  const { getContentfulPage } = useContentStore();
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

  const { data, error } = await getContentfulPage(path);

  if (error.value) {
    throw Error(error.value);
  }
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
