<template>
  <footer class="footer">
    <Container class="footer__inner">
      <div>&copy; {{ currentYear }} Dan Kiser</div>
      <ul class="footer__icon-container">
        <li class="footer__icon" v-for="(icon, key) in icons" :key>
          <a :href="icon.url" :title="icon.title" @click="track(icon.trackTag)">
            <component :is="icon.src" />
          </a>
        </li>
      </ul>
    </Container>
  </footer>
</template>

<script setup lang="ts">
  import { inject, type Ref } from 'vue';
  import { matomoKey } from 'vue-matomo';
  import Container from '@/components/Container.vue';
  import GitHub from '@/components/icons/IconGitHub.vue';
  import LinkedIn from '@/components/icons/IconLinkedIn.vue';
  import Email from '@/components/icons/IconEmail.vue';

  const matomo = inject<Ref>(matomoKey);
  const currentYear = new Date().getFullYear();
  const icons = [
    {
      src: GitHub,
      url: 'https://github.com/dankc/',
      title: 'Visit my Github profile.',
      trackTag: 'GitHub Link',
    },
    {
      src: LinkedIn,
      url: 'https://www.linkedin.com/in/dankiser1/',
      title: 'Visit my LinkedIn profile.',
      trackTag: 'LinkedIn Link',
    },
    { src: Email, url: 'mailto:dankc@pm.me', title: 'Send me an email.', trackTag: 'Email Link' },
  ];

  const track = (description: string) => {
    matomo?.value?.trackEvent('Footer', 'Click', description);
  };
</script>

<style lang="postcss">
  .footer {
    padding: 1.5rem 0;
    background-color: var(--red-bold);
    color: var(--white);

    &__inner {
      display: flex;
      align-items: center;
      flex-direction: column-reverse;

      @media (min-width: 485px) {
        flex-direction: row;
      }
    }

    &__icon-container {
      display: flex;
      gap: 0 40px;
      margin-bottom: 30px;
      padding: 0;
      list-style-type: none;

      @media (min-width: 485px) {
        margin-bottom: initial;
        margin-left: 2rem;
        padding: 0 2rem;
        border-left: 1px solid var(--white);
      }
    }

    &__icon {
      svg {
        width: auto;
        height: 30px;
        transition: fill 0.2s ease-in-out;
      }

      &:hover svg {
        fill: var(--blue-bold);
      }
    }
  }
</style>
