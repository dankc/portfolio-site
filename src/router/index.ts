import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/stores/global.ts';
import Home from '@/views/Home.vue';

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: () => import('../views/PrivacyPolicy.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      name: '404',
      component: () => import('../views/404.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    const { headerHeight } = storeToRefs(useGlobalStore());

    if (to.hash) {
      return {
        el: to.hash,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        top: headerHeight.value,
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
