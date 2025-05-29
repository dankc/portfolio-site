<template>
  <Nav ref="global-nav" />

  <div class="page-body">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <Transition name="blur" mode="in-out">
          <Suspense timeout="0">
            <template #default>
              <component
                :is="Component"
                :key="route.path"
                :style="{ '--header-height': `${headerHeight}px`, '--footer-height': `${footerHeight}px` }"
              />
            </template>
            <template #fallback> <Loading /> </template>
          </Suspense>
        </Transition>
      </template>
    </router-view>
    <div v-if="fetchError" class="error">
      {{ fetchError }}
      <button class="button" @click.prevent="retryFetch">Reload page</button>
    </div>
  </div>

  <Footer ref="global-footer" />
</template>

<script setup lang="ts">
  import { ref, useTemplateRef, onMounted, onErrorCaptured, type ComponentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/global';
  import { useElementHeight } from '@/composables/useElementHeight.ts';
  import { useMeta } from '@/composables/useMeta.ts';
  import { useMatomo } from 'vue3-matomo';
  import MetaTags from '@/data/meta-tags.json';
  import Nav from '@/components/Nav.vue';
  import Footer from '@/components/Footer.vue';
  import Loading from '@/views/Loading.vue';

  const { go } = useRouter();
  const matomo = useMatomo();
  const { headerHeight, footerHeight } = storeToRefs(useGlobalStore());
  const { setMeta } = useMeta();
  setMeta({
    ...MetaTags,
  });

  const fetchError = ref<string | null>(null);
  const retryFetch = () => {
    fetchError.value = null;
    go(0);
  };

  const globalNav = useTemplateRef<ComponentInstance<HTMLElement>>('global-nav');
  const globalFooter = useTemplateRef<ComponentInstance<HTMLElement>>('global-footer');

  onMounted(() => {
    headerHeight.value = useElementHeight(globalNav.value?.$el);
    footerHeight.value = useElementHeight(globalFooter.value?.$el);
  });

  onErrorCaptured((error, vm, info) => {
    matomo.value?.trackEvent('Site Health', 'Error', 'Error captured in App.vue');
    fetchError.value = error.message || 'An error occurred while fetching page data';
    console.error('Error captured:', error);
    console.error('Vue component:', vm);
    console.error('Error info:', info);
    return false;
  });
</script>

<style scoped lang="postcss">
  .error {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    color: red;
    padding: 1rem;
    text-align: center;

    .button {
      margin-left: 1rem;
      background-color: var(--green-bold);
    }
  }
</style>
