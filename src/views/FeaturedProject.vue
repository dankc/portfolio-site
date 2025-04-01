<template>
  <IntersectionObserver :target="() => featProjRef" :callback>
    <section id="feat-project" class="feat-proj" ref="featProjRef">
      <Container class="feat-proj__inner">
        <div class="feat-proj__content">
          <TabView :tabs="tabs" @tab-change="handleTabChange">
            <template v-slot:nav>
              <h2 class="feat-proj__heading">
                <span class="eyebrow">{{ heading }}</span>
              </h2>
            </template>
            <h3 class="feat-proj__heading">
              {{ activeContent.name }}
            </h3>
            <p class="feat-proj__paragraph">
              {{ activeContent.description }}
            </p>
            <!--Haven't figured out how to integrate this yet.-->
            <!--<code @click="copyToClipboard('npm i responsive-vid')">-->
            <!--  # Add it to your project-->
            <!--  <br />-->
            <!--  > npm i responsive-vid <span class="cursor"></span>-->
            <!--</code>-->
            <div class="feat-proj__buttons">
              <a
                class="feat-proj__button button"
                v-for="({ copy, url, tracking }, key) in activeContent.buttons"
                :key
                :href="url"
                @click="trackButton(tracking)"
              >
                {{ copy }}
              </a>
            </div>
          </TabView>
        </div>
        <div class="feat-proj__image">
          <img :src="requireImage(activeContent.image)" :alt="`${activeContent.name} logo`" width="300" height="220" />
        </div>
      </Container>
    </section>
  </IntersectionObserver>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useMatomo } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  // import { useClipboard } from '@/composables/useClipboard.ts';
  import { heading, projects } from '@/data/featured-projects.json';
  import Container from '@/components/Container.vue';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';
  import TabView from '@/components/TabView.vue';

  // const { copyToClipboard } = useClipboard();
  const { changeActiveRoute } = useGlobalStore();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());

  const matomo = useMatomo();
  const featProjRef = ref();
  const activeView = ref(0);
  const activeContent = computed(() => projects[activeView.value]);
  const tabs = projects.map(({ name }) => name);

  function requireImage(url: string): string {
    return `${url}`;
  }

  const handleTabChange = (tab: number) => {
    activeView.value = tab;
    track(['Tab', 'Click', tabs[tab]]);
  };

  const track = (values: string[]) => {
    if (!isUserOptedOut.value) matomo.value?.trackEvent(...values);
  };

  const trackButton = (description: string) => {
    track(['Button', 'Click', `Featured Project - ${description}`]);
  };

  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;
      if (isIntersecting) {
        changeActiveRoute('feat-project');
      }
    });
  };
</script>

<style lang="postcss">
  .feat-proj {
    margin-top: var(--section-gap);
    padding: 1.25rem 0 1.75rem;
    background-color: var(--green-bold);
    color: var(--black);

    @media (min-width: 600px) {
      clip-path: var(--angle-shape);
    }

    &__heading {
      font-family: var(--f-mono);
      font-size: 2.625rem;
      font-weight: 700;
      line-height: 1;
    }

    &__paragraph {
      margin-top: 1.5rem;
      font-size: 1.125rem;
      text-wrap: balance;
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 1.5rem 0;
      text-align: center;

      @media (min-width: 620px) {
        flex-direction: row;
      }
    }

    &__button {
      background-color: var(--black);
      color: var(--white);

      &:hover {
        background-color: var(--blue-bold);
      }
    }

    &__image {
      position: relative;

      @media (min-width: 1024px) {
        margin-left: 1.5rem;
      }

      & img {
        width: 100%;

        @media (min-width: 1024px) {
          width: auto;
        }
      }
    }

    .eyebrow {
      font-size: 1rem;
      text-transform: uppercase;
    }

    .container {
      display: flex;
      align-items: center;
      flex-direction: column-reverse;

      @media (min-width: 600px) and (max-width: 795px) {
        padding-right: calc(var(--angle-depth) + 20px);
      }

      @media (min-width: 1024px) {
        flex-direction: row;
        padding-right: var(--angle-depth);
      }
      @media (min-width: 1540px) {
        max-width: var(--max-content-width);
      }
    }

    .tab-view {
      margin-top: 1rem;

      &__nav-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem 2.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--off-black);

        @media (min-width: 600px) {
          width: max-content;
          flex-direction: row;
          align-items: flex-start;
          gap: 0 2.5rem;
        }
      }

      &__nav {
        display: flex;
        gap: 0 1rem;
      }

      &__nav-item {
        padding: 0.625rem;
        background-color: rgb(from var(--black) r g b / 10%);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 3px solid transparent;
        transition: all 0.2s ease-in-out;
      }

      &__pane {
        margin-top: 1.5rem;
      }

      .active {
        background-color: var(--black);
        color: var(--green-bold);
        border-bottom: 3px solid var(--red-bold);
      }
    }

    /*.cursor {
      display: inline-flex;
      width: 1ch;
      height: 1.75ch;
      position: relative;
      top: 3px;
      background-color: green;
      animation: fade 0.75s infinite alternate-reverse;
    }

    & code {
      display: block;
      width: max-content;
      margin: 1.5rem 0;
      padding: 1rem 2rem;
      background-color: var(--off-black);
      color: green;
      line-height: 2;
    }*/
  }
</style>
