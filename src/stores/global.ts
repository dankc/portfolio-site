import { defineStore } from 'pinia';
import { computed, type ComputedRef, ref, type Ref } from 'vue';

interface GlobalState {
  activeSection: Ref<string>;
  footerHeight: Ref<number>;
  headerHeight: Ref<number>;
  isUserOptedOut: Ref<boolean>;
  isTallEnoughForIO: ComputedRef<boolean>;
  changeActiveSection: (hash: string) => void;
}

export const useGlobalStore = defineStore('global', (): GlobalState => {
  // activeSection used in the nav to toggle active state of links on mobile
  const activeSection = ref('home');
  const footerHeight = ref(80);
  const headerHeight = ref(80);
  const isUserOptedOut = ref(false);

  const isTallEnoughForIO = computed({
    get: () => {
      const mediaQuery = window.matchMedia('(max-width: 1023px)');
      return mediaQuery.matches;
    },
    set: () => null,
  });

  function changeActiveSection(hash: string) {
    activeSection.value = hash;
  }
  return {
    activeSection,
    footerHeight,
    headerHeight,
    isTallEnoughForIO,
    isUserOptedOut,
    changeActiveSection,
  };
});
