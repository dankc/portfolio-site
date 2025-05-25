<template>
  <Nav ref="global-nav" :class="{ 'modal-open': isModalOpen }" />

  <div class="page-body">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition name="blur">
          <Suspense timeout="0">
            <template #default>
              <component
                :is="Component"
                :key="route.path"
                :class="{ 'modal-open': isModalOpen }"
                :style="{ '--header-height': `${headerHeight}px`, '--footer-height': `${footerHeight}px` }"
              />
            </template>
            <template #fallback> <Loading /> </template>
          </Suspense>
        </transition>
      </template>
    </router-view>
    <div v-if="fetchError" class="error">
      {{ fetchError }}
      <button class="button" @click.prevent="retryFetch">Reload page</button>
    </div>
  </div>

  <Footer ref="global-footer" :class="{ 'modal-open': isModalOpen }" />
</template>

<script setup lang="ts">
  import { ref, useTemplateRef, onMounted, onErrorCaptured, type ComponentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global';
  import { useElementHeight } from '@/composables/useElementHeight.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import MetaTags from '@/data/meta-tags.json';
  import Nav from '@/components/Nav.vue';
  import Footer from '@/components/Footer.vue';
  import Loading from '@/views/Loading.vue';

  const { go } = useRouter();
  const { isModalOpen, headerHeight, footerHeight } = storeToRefs(useGlobalStore());
  const { setMeta } = useMeta();
  setMeta({
    ...MetaTags,
  });

  const fetchError = ref<string | null>(null);
  const retryFetch = () => {
    fetchError.value = null;
    go(0);
  };

  const globalNav = useTemplateRef('global-nav');
  const globalFooter = useTemplateRef('global-footer');

  onMounted(() => {
    headerHeight.value = useElementHeight((globalNav.value as ComponentInstance<HTMLElement>).$el);
    footerHeight.value = useElementHeight((globalFooter.value as ComponentInstance<HTMLElement>).$el);
  });

  onErrorCaptured((error, vm, info) => {
    fetchError.value = error.message || 'An error occurred while fetching page data';
    console.error('Error captured:', error);
    console.error('Vue component:', vm);
    console.error('Error info:', info);
    return false;
  });
</script>

<style scoped lang="postcss">
  .error {
    color: red;
    padding: 1rem;
    text-align: center;

    .button {
      margin-left: 1rem;
      background-color: var(--green-bold);
    }
  }
</style>
