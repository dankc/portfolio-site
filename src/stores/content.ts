import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { useRest, type FetchResponse } from '@/composables/useRest.ts';
import type { ExtendedPageFields } from '@/types/contentful';

type PageStore = Record<string, ExtendedPageFields>;

export const useContentStore = defineStore('content', () => {
  const pageStore = ref<PageStore>({});

  // Get all data for a page, cache it, and serve the cache if it's there
  const getContentfulPage = async (slug: string): Promise<FetchResponse<ExtendedPageFields>> => {
    const { getContent } = useRest();
    const ttl = 24 * 60 * 60 * 1000; // 24h
    const cache = pageStore.value.hasOwnProperty(slug) ? pageStore.value[slug] : sessionStorage.getItem(`page-${slug}`);
    if (cache) {
      let _data;
      if (typeof cache === 'string') {
        const _timestamp = JSON.parse(cache).timestamp;
        _data = JSON.parse(cache).data;
        if (Date.now() - _timestamp > ttl) {
          sessionStorage.removeItem(`page-${slug}`);
          delete pageStore.value[slug];
          return getContentfulPage(slug);
        }
        pageStore.value[slug] = _data;
      } else {
        _data = toRaw(cache);
      }
      return {
        data: ref(_data),
        pending: ref(false),
        success: ref(true),
        error: ref(''),
      };
    }

    const { data, pending, success, error } = await getContent<ExtendedPageFields>(
      `?content_type=page&fields.slug=${slug}&include=3`
    );

    if (success.value) {
      pageStore.value[slug] = data.value as ExtendedPageFields;
      sessionStorage.setItem(`page-${slug}`, JSON.stringify({ timestamp: Date.now(), data: data.value }));
    }
    return { data, pending, success, error };
  };

  return {
    pageStore,
    getContentfulPage,
  };
});
