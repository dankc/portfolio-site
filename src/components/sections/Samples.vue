<template>
  <IntersectionObserver :callback :target="() => workRef">
    <section class="samples" ref="workRef" id="work">
      <Container class="samples__container">
        <h2 class="samples__heading">{{ data.heading }}</h2>
        <div class="samples__inner">
          <ul class="samples__grid">
            <li
              v-for="(sample, index) in data.sectionContentList"
              :key="index"
              role="listitem"
              title="Click to preview"
            >
              <button type="button" :aria-label="`Click to view details for ${sample.campaign || sample.client || 'this'} project`" @click.stop="openModal(sample)">
                <img :src="sample.thumbnail" alt="" width="323" height="200" />
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  </IntersectionObserver>

  <Teleport to="body">
    <Modal :toggle-on="selectedWork !== undefined" :transition="{ name: 'scale', appear: true }" @on-close="closeModal" headingId="selected-work-heading">
      <div class="work-modal">
        <header class="work-modal__header">
          <hgroup>
            <h2 class="work-modal__heading" id="selected-work-heading">
              {{ selectedWork?.client }}
            </h2>
            <p class="work-modal__subheading">
              {{ selectedWork?.campaign || selectedWork?.type }}
            </p>
          </hgroup>

          <a
            v-if="selectedWork?.type === 'site'"
            :href="selectedWork.origin"
            class="button"
            referrerpolicy="no-referrer"
            rel="nofollow noopener"
          >
            Visit {{ selectedWork.client }}
          </a>
        </header>

        <div class="work-modal__image-container">
          <BasePicture
            v-if="selectedWork?.srcLg && selectedWork?.srcSm"
            :sources="{ lg: selectedWork.srcLg, sm: selectedWork.srcSm }"
            :alt="selectedWork?.altText || ''"
          />
          <img v-else :src="`https://res.cloudinary.com/dmez1qk98/image/upload/q_65,f_webp,dpr_auto/${selectedWork?.srcLg}`" :alt="selectedWork?.altText || ''" loading="lazy" />
        </div>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup lang="ts">
  import type { Ref } from 'vue';
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useMatomo } from 'vue3-matomo';
  import { useGlobalStore } from '@/stores/global.ts';
  import Modal from '@/components/Modal.vue';
  import Container from '@/components/Container.vue';
  import BasePicture from '@/components/BasePicture.vue';
  import IntersectionObserver from '@/components/IntersectionObserver.vue';
  import type { ISampleFields, ISectionFields } from '@/types/contentful-generated-types';

  const { data } = defineProps<{
    data: ISectionFields & { sectionContentList: ISampleFields[] };
  }>();

  const matomo = useMatomo();
  const { changeActiveSection } = useGlobalStore();
  const { isUserOptedOut } = storeToRefs(useGlobalStore());
  const workRef = ref();
  const selectedWork: Ref<ISampleFields | undefined> = ref(undefined);

  function openModal(data: ISampleFields): void {
    if (!isUserOptedOut.value) {
      matomo.value?.trackEvent('Modal', 'Open', `${data.client}-${data.type}-${data.campaign || ''}`);
    }
    selectedWork.value = data;
  }
  function closeModal(): void {
    if (!isUserOptedOut.value) matomo.value?.trackEvent('Modal', 'Close');
    selectedWork.value = undefined;
  }
  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const { isIntersecting } = entry;

      if (isIntersecting) {
        changeActiveSection('work');
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

      button {
        padding: 0;
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
    padding: 60px 20px 0;
    color: var(--white);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;

      @media (min-width: 1024px) {
        align-items: flex-end;
        flex-direction: row;
        gap: 0;
        text-align: left;
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
