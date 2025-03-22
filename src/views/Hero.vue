<template>
  <section class="hero" id="hero">
    <Container class="hero__inner">
      <div class="hero__copy-container">
        <h1 class="hero__heading">{{ heading }}</h1>
        <p class="hero__paragraph">{{ paragraph }}</p>
        <a class="hero__button button" :href="cta.link">{{ cta.text }}</a>
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
  import { heading, paragraph, cta } from '@/data/hero.json';
  import Container from '@/components/Container.vue';
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
      font-size: 6rem;
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
