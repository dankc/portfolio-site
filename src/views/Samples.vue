<template>
  <IntersectionObserver :callback :target="() => workRef">
    <section class="samples" ref="workRef" id="work">
      <Container class="samples__container">
        <h2 class="samples__heading">Selected Work</h2>
        <div class="samples__inner">
          <ul class="samples__grid">
            <li
              v-for="(sample, index) in samples"
              :key="index"
              title="Click to preview"
              @click.stop="openModal(sample)"
            >
              <BasePicture
                v-if="typeof sample.src === 'object'"
                :sources="sample.src"
                alt="Click to preview this work"
                width="323"
                height="200"
              />
              <img
                v-else
                :src="requireImage(sample.src)"
                alt="Click to preview this work"
                width="323"
                height="200"
              />
            </li>
          </ul>
        </div>
      </Container>
    </section>
  </IntersectionObserver>

  <teleport to="body">
    <modal v-if="selectedWork" @close-modal="closeModal">
      <section class="work-modal">
        <header class="work-modal__header">
          <div>
            <h2 class="work-modal__heading">
              {{ selectedWork.client }}
            </h2>
            <h3 class="work-modal__subheading">
              {{ selectedWork.campaign || selectedWork.displayType }}
            </h3>
          </div>

          <a
            v-if="selectedWork.displayType === 'site'"
            :href="selectedWork.origin"
            class="button"
            referrerpolicy="no-referrer"
            rel="nofollow noopener"
          >
            Visit {{ selectedWork.client }}
          </a>
        </header>

        <div class="work-modal__image-container">
          <BasePicture v-if="typeof selectedWork.src === 'object'" :sources="selectedWork.src" />
          <img v-else :src="selectedWork.src" alt="" />
        </div>
      </section>
    </modal>
  </teleport>
</template>

<script setup lang="ts">
  import { matomoKey } from 'vue-matomo';
  import type { Ref } from 'vue';
  import { ref, inject } from 'vue';
  import { useGlobalStore } from '@/stores/global.ts';
  import type { WorkData } from '@/types/work';
  import { samples } from '@/data/work.json';
  import Modal from '@/components/Modal.vue';
  import Container from '@/components/Container.vue';
  import BasePicture from '@/components/BasePicture.vue';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';

  const { changeActiveRoute, toggleModal } = useGlobalStore();

  const matomo = inject<Ref>(matomoKey);
  const workRef = ref();
  const selectedWork: Ref<WorkData | undefined> = ref(undefined);

  function openModal(data: WorkData): void {
    matomo?.value?.trackEvent(
      'Modal',
      'Open',
      `${data.client}-${data.type}-${data.campaign || ''}`
    );
    toggleModal();
    selectedWork.value = data;
  }
  function closeModal(): void {
    matomo?.value?.trackEvent('Modal', 'Close');
    toggleModal();
    selectedWork.value = undefined;
  }
  function requireImage(url: string | { sm: string; lg: string }): string {
    if (typeof url === 'object') return url.lg;
    return `${url}`;
  }
  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;
      const isTallEnoughForIO = window.matchMedia('(max-width: 1023px)').matches;

      if (isIntersecting && isTallEnoughForIO) {
        changeActiveRoute('work');
      }
    });
  };
</script>

<style lang="postcss">
  .samples {
    &__heading {
      display: inline-block;
      margin-bottom: 1.5rem;
      font-family: var(--f-mono);
      font-size: 2.625rem;
      font-weight: 700;
      color: var(--white);
      text-transform: uppercase;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        margin-top: 0.5rem;
        background-color: var(--red-bold);
      }
    }

    &__paragraph {
      margin: 2rem 0;
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
      padding: 0;
      list-style-type: none;

      @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
      }

      li {
        background-color: var(--off-black);
        max-height: 200px;
        overflow: hidden;
        cursor: pointer;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        transition: transform 0.2s ease-in-out;

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  .work-modal {
    width: 95%;
    max-width: var(--max-content-width);
    margin: 0 auto;
    padding: 20px;
    color: var(--white);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      gap: 1.5rem;

      @media (min-width: 1024px) {
        align-items: flex-end;
        flex-direction: row;
        gap: 0;
      }
    }

    &__image-container {
      position: relative;
      margin: 40px 0;
      padding: 25px;

      &::before {
        content: '';
        padding: 25px;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        background: var(--yellow);
        clip-path: var(--angle-shape);
      }

      img {
        width: 100%;
      }
    }

    .button {
      background-color: var(--green-bold);
    }
  }
</style>
