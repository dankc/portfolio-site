<template>
  <section class="privacy-policy">
    <h2 class="privacy-policy__heading">{{ heading }}</h2>
    <p class="privacy-policy__paragraph" v-html="parsedCopy"></p>
    <ul class="privacy-policy__list">
      <li v-for="(item, key) in list" :key>
        {{ item }}
      </li>
    </ul>
    <button class="privacy-policy__opt-out button" @click.prevent="optOut">{{ optOutButton }}</button>
  </section>
</template>

<script setup lang="ts">
  import { inject, type Ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import { useParsePlaceholders } from '@/composables/useParsePlaceholders.ts';
  import { heading, paragraph, list, optOutButton } from '@/data/privacy-policy.json';
  import { matomoKey } from 'vue3-matomo';

  const matomo = inject<Ref>(matomoKey);
  const { setMeta } = useMeta();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());
  const { parseLinks } = useParsePlaceholders();
  const parsedCopy = parseLinks(paragraph);
  const optOut = () => {
    matomo?.value?.optUserOut();
    isUserOptedOut.value = true;
  };

  setMeta({
    title: 'Privacy Policy | kiser.codes',
  });
</script>

<style lang="postcss">
  .privacy-policy {
    max-width: calc(800px + var(--gutter));
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    margin: 0 auto;
    padding: var(--section-gap) var(--gutter) 0;

    &__heading {
      font-family: var(--f-mono);
      font-size: 2.625rem;
      font-weight: 700;
      color: var(--white);
      text-transform: uppercase;
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
