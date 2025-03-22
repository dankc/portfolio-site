<template>
  <IntersectionObserver :callback :target="() => aboutRef">
    <section class="about" id="about" ref="aboutRef">
      <div>
        <h2 class="about__heading">{{ heading }}</h2>
        <p
          class="about__paragraph"
          v-for="(paragraph, index) in parsedParagraphs"
          :key="index"
          v-html="paragraph"
        ></p>
      </div>
      <div class="about__skills">
        <h3 class="about__skills-heading">{{ skillsHeading }}</h3>
        <ul class="about__skills-list">
          <li v-for="({ bgColor, color }, key) in skills" :key="key">
            <SkillPill :bg-color="bgColor" :color="color">
              {{ key }}
            </SkillPill>
          </li>
        </ul>
      </div>
    </section>
  </IntersectionObserver>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useGlobalStore } from '@/stores/global.ts';
  import type { SkillPills } from '@/types/about';
  import { heading, paragraphs, skillsHeading, skillsList } from '@/data/about.json';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';
  import SkillPill from '@/components/SkillPill.vue';

  const { changeActiveRoute } = useGlobalStore();
  const aboutRef = ref();

  const skills: SkillPills = skillsList;
  const timeDeveloping: number = new Date().getFullYear() - 2014;
  const timeWebDeveloping: number = new Date().getFullYear() - 2016;
  const timeWithVue: number = new Date().getFullYear() - 2018;
  const placeholderValues: { [K: string]: number } = {
    timeDeveloping: timeDeveloping,
    timeWebDeveloping: timeWebDeveloping,
    timeWithVue: timeWithVue,
  };

  const parseCopy = (copy: string): string => {
    let parsedCopy = copy;
    const placeholders = copy.match(new RegExp(/\$\{\w+}/, 'g')) || [];
    const getPlaceholderValue = (placeholder: string): string => {
      placeholder = placeholder.replace(new RegExp(/\$|\{|}/, 'g'), '');
      return `${placeholderValues[placeholder]}`;
    };

    if (placeholders.length)
      placeholders.forEach((placeholder) => {
        parsedCopy = parsedCopy.replace(placeholder, getPlaceholderValue(placeholder));
      });
    return parsedCopy;
  };

  const parsedParagraphs = paragraphs.map((paragraph) => parseCopy(paragraph));

  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;
      const isTallEnoughForIO = window.matchMedia('(max-width: 1023px)').matches;

      if (isIntersecting && isTallEnoughForIO) {
        changeActiveRoute('about');
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
    &__skills-heading {
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

    &__skills-heading {
      font-size: 1.5rem;
      margin: 1.5rem 0 0.75rem;
    }

    &__skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
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
