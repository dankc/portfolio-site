import { defineStore } from 'pinia';
import { computed, type ComputedRef, ref, type Ref } from 'vue';

interface GlobalState {
  isModalOpen: Ref<boolean>;
  activeRoute: Ref<string>;
  isTallEnoughForIO: ComputedRef<boolean>;
  toggleModal: () => void;
  changeActiveRoute: (route: string) => void;
}

export const useGlobalStore = defineStore('global', (): GlobalState => {
  const isModalOpen = ref(false);
  const activeRoute = ref('home');

  const isTallEnoughForIO = computed({
    get: () => {
      const mediaQuery = window.matchMedia('(max-width: 1023px)');
      return mediaQuery.matches;
    },
    set: () => null,
  });

  function toggleModal() {
    isModalOpen.value = !isModalOpen.value;
  }
  function changeActiveRoute(route: string) {
    activeRoute.value = route;
  }
  return { activeRoute, changeActiveRoute, isTallEnoughForIO, isModalOpen, toggleModal };
});
