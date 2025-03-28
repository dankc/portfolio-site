<template>
  <IntersectionObserver :target="() => featProjRef" :callback>
    <section id="feat-project" class="feat-proj" ref="featProjRef">
      <Container class="feat-proj__inner">
        <div class="feat-proj__content">
          <h2 class="feat-proj__heading">
            <span class="eyebrow">Featured Project</span>
            <br />Responsive-Vid
          </h2>
          <p class="feat-proj__paragraph">
            A TypeScript-supported library for Vue 3, JavaScript modules, and browser scripts to dynamically swap video sources
            and posters based on media queries. Perfect for autoplaying background videos with varying file sizes or aspect ratios
            across viewport widths—or any media query condition like resolution or orientation.
          </p>
          <!--<code @click="copyToClipboard('npm i responsive-vid')">-->
          <!--  > npm i responsive-vid <span class="cursor"></span>-->
          <!--</code>-->
          <div class="feat-proj__buttons">
            <a class="feat-proj__button button" href="https://www.npmjs.com/package/responsive-vid" @click="track('NPM Page')"
              >View NPM page</a
            >
            <a class="feat-proj__button button" href="https://github.com/dankc/responsive-vid" @click="track('GitHub Page')"
              >View Code on GitHub</a
            >
          </div>
        </div>
        <div class="feat-proj__image">
          <img
            :src="requireImage('static/img/terminal-graphic.svg')"
            alt="Image of terminal showing responsive-vid being installed with NPM."
            width="300"
            height="220"
            @click="copyToClipboard('npm i responsive-vid')"
          />
        </div>
      </Container>
    </section>
  </IntersectionObserver>
</template>

<script setup lang="ts">
  import { inject, type Ref, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { matomoKey } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  import { useClipboard } from '@/composables/useClipboard.ts';
  import Container from '@/components/Container.vue';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';

  const { copyToClipboard } = useClipboard();
  const { changeActiveRoute } = useGlobalStore();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());

  const matomo = inject<Ref>(matomoKey);
  const featProjRef = ref();

  function requireImage(url: string): string {
    return `${url}`;
  }

  const track = (description: string) => {
    if (!isUserOptedOut.value) matomo?.value?.trackEvent('Button', 'Click', `Featured Project - ${description}`);
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

      & .eyebrow {
        font-size: 1rem;
        text-transform: uppercase;
      }
    }

    &__paragraph {
      margin: 1.5rem 0 1rem;
      font-size: 1.125rem;
      text-wrap: balance;
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
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

    .cursor {
      display: inline-flex;
      width: 1ch;
      height: 1.5ch;
      background-color: green;
      animation: fade 0.75s infinite alternate-reverse;
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

    & code {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 1.25rem;
      background-color: var(--off-black);
      color: green;
    }
  }
</style>
