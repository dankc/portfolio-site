<template>
  <div class="nav" ref="nav">
    <Container>
      <div class="nav__inner">
        <div class="nav__logo" @click="scrollToTop">
          <IconLogoMonoWhite />
        </div>
        <div class="nav__hamburger-container">
          <button
            class="nav__hamburger"
            :class="{ active: isMenuOpen }"
            @click="toggleMenu"
            role="switch"
            aria-label="Toggle Menu"
            name="menu"
          ></button>
        </div>
        <nav class="nav__content" :class="{ open: isMenuOpen }">
          <a
            v-for="{ name, text, display } in links"
            :key="name"
            class="nav__item"
            :class="{ active: name === activeRoute, 'dt-hidden': display === 'mobile' }"
            :href="`#${name}`"
          >
            {{ text }}
          </a>
          <a class="nav__item" href="mailto:dankc@pm.me">Contact</a>
        </nav>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global.ts';
  import { links } from '@/data/nav.json';
  import IconLogoMonoWhite from '@/components/icons/IconLogoMonoWhite.vue';
  import Container from './Container.vue';

  const globalStore = useGlobalStore();
  const { activeRoute } = storeToRefs(globalStore);
  const isMenuOpen = ref(false);
  const mediaQuery = window.matchMedia('(min-width: 600px)');

  const closeMenuOnDt = ({ matches }: MediaQueryListEvent) => {
    if (matches && isMenuOpen.value) toggleMenu();
  };

  const toggleMenu = (): void => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const scrollToTop = (): void => {
    const _isReducedMotion: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: _isReducedMotion ? 'auto' : 'smooth',
    });
  };

  onMounted(() => {
    mediaQuery.addEventListener('change', closeMenuOnDt);
  });

  onBeforeUnmount(() => {
    mediaQuery.removeEventListener('change', closeMenuOnDt);
  });
</script>

<style lang="postcss">
  .nav {
    position: sticky;
    top: 0;
    z-index: 1;
    background: linear-gradient(
      to right,
      var(--red-bold) 50%,
      rgb(from var(--black) r g b / 80%) 50%
    );
    backdrop-filter: blur(3px);

    &__inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      font-family: var(--f-mono);
    }

    &__logo {
      display: flex;
      align-items: center;
      padding: 15px 0;
      position: relative;
      background-color: var(--red-bold);
      color: var(--white);

      &::before {
        content: '';
        display: block;
        width: 50vw;
        position: absolute;
        top: 0;
        left: -90%;
        bottom: 0;
        z-index: -1;
        background-color: var(--red-bold);
      }

      & svg {
        height: 50px;
        transition: transform 0.5s ease-in-out;

        &:hover {
          transform: rotate3d(0, 5, 0, 45deg);
        }
      }
    }

    &__hamburger-container {
      display: flex;
      align-items: center;

      @media (min-width: 600px) {
        display: none;
      }
    }

    &__hamburger {
      display: flex;
      align-items: center;
      width: 32px;
      height: 32px;
      margin-left: auto;
      padding: 0;
      border: none;
      border-top: 2px solid var(--yellow);
      border-bottom: 2px solid var(--yellow);
      background: transparent;
      position: relative;
      appearance: none;
      cursor: pointer;
      transition: border-color 0.33s ease-in-out;

      &.active {
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;

        &::before {
          transform: rotate(-45deg);
        }

        &::after {
          transform: rotate(45deg);
        }
      }

      &::before,
      &::after {
        content: '';
        display: block;
        height: 2px;
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        background-color: var(--yellow);
        transition: transform 0.33s ease-in-out;
      }
    }

    &__content {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-direction: column;
      padding-right: var(--gutter);
      position: absolute;
      width: 50%;
      bottom: 0;
      right: 0;
      z-index: -1;
      background-color: rgb(from var(--black) r g b / 80%);
      backdrop-filter: blur(3px);
      color: var(--white);
      opacity: 0;
      overflow: hidden;
      transform: translateY(0);
      transition: all 0.33s ease-in-out;

      @media (min-width: 600px) {
        justify-content: space-around;
        flex-direction: row;
        width: auto;
        padding-right: 0;
        position: relative;
        bottom: unset;
        right: unset;
        z-index: 0;
        opacity: 1;
        background-color: transparent;
        backdrop-filter: initial;
      }

      /*&::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      backdrop-filter: blur(3px);

      @media (min-width: 600px) {
        backdrop-filter: initial;
      }
    }*/

      &.open {
        opacity: 1;
        transform: translateY(100%);
      }

      a {
        margin: 1rem 0;

        @media (min-width: 600px) {
          margin: unset;
        }
      }
    }

    &__item {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      color: var(--white);
      text-decoration: none;
      font-weight: 700;

      @media (min-width: 600px) {
        justify-content: center;
      }

      &::before {
        content: '';
        width: 0;
        height: 1px;
        background-color: var(--white);
        position: absolute;
        bottom: 0;
        transition: width 0.33s ease-in-out;
      }

      &:not(.active):hover {
        &::before {
          width: 100%;
        }
      }

      &.active {
        text-decoration: underline;
      }
    }
  }

  .dt-hidden {
    @media (min-width: 600px) {
      display: none;
    }
  }
</style>
