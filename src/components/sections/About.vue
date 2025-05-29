<template>
  <IntersectionObserver :callback :target="() => aboutRef">
    <section class="about" id="about" ref="aboutRef">
      <div>
        <h2 class="about__heading">{{ data.heading }}</h2>
        <p class="about__paragraph" v-for="(paragraph, index) in parsedParagraphs" :key="index" v-html="paragraph"></p>
      </div>
      <template v-for="(subsection, index) in data.subSections" :key="index">
        <div class="about__subsection">
          <h3 class="about__subsection-heading">{{ subsection.heading }}</h3>
          <ul class="about__subsection-list">
            <li v-for="({ bgColor, color, text }, key) in subsection.pills" :key="key">
              <SkillPill :bg-color="bgColor" :color="color">
                {{ text }}
              </SkillPill>
            </li>
          </ul>
        </div>
      </template>
    </section>
  </IntersectionObserver>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useGlobalStore } from '@/stores/global.ts';
  import { useParsePlaceholders, type PlaceHolderValues } from '@/composables/useParsePlaceholders.ts';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';
  import SkillPill from '@/components/SkillPill.vue';
  import type { ISectionFields } from '@/types/contentful-generated-types';

  const { data } = defineProps<{
    data: ISectionFields;
  }>();

  const { changeActiveSection } = useGlobalStore();
  const { parseCopy } = useParsePlaceholders();
  const aboutRef = ref();

  const timeDeveloping: number = new Date().getFullYear() - 2014;
  const timeWebDeveloping: number = new Date().getFullYear() - 2016;
  const timeWithVue: number = new Date().getFullYear() - 2018;
  const placeholderValues: PlaceHolderValues = {
    timeDeveloping: timeDeveloping,
    timeWebDeveloping: timeWebDeveloping,
    timeWithVue: timeWithVue,
  };

  const parsedParagraphs = (data.paragraphs as string[]).map((paragraph) => parseCopy(paragraph, placeholderValues));

  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;

      if (isIntersecting) {
        changeActiveSection('about');
      }
    });
  };
</script>

<style lang="postcss">
  @keyframes float {
    0% {
      transform: translateY(-10%);
    }
    100% {
      transform: translateY(10%);
    }
  }

  .about {
    max-width: var(--max-content-width);
    margin: 2.5rem auto 0;
    padding: 2.5rem var(--gutter) 5rem;

    &__paragraph {
      margin: 1.5rem auto;
    }

    &__heading,
    &__subsection-heading {
      display: inline-block;
      font-family: var(--f-mono);
      font-size: 2.625rem;
      font-weight: 700;
      color: var(--white);
      text-transform: uppercase;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 0.125rem;
        margin-top: 0.5rem;
        background-color: var(--blue-bold);
      }
    }

    &__subsection-heading {
      font-size: 1.5rem;
      margin: 1.5rem 0 0.75rem;
    }

    &__subsection-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem 0.625rem;
      margin-top: 1.25rem;
      padding-left: 0;
      list-style-type: none;
    }

    & .pill {
      min-width: 3.75rem;
      text-align: center;
    }

    & kbd {
      display: inline-block;
      margin-left: 1ch;
      padding: 0.125rem 0.25rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: var(--black);
      will-change: transform;
      animation: float 3s alternate-reverse infinite;
      font-family: monospace;
      background-color: #f7f7f7;
    }
  }
</style>
