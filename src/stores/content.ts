import { ref, toRaw, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { useRest, type FetchResponse } from '@/composables/useRest.ts';
import type { IPageFields, ContentfulEntryFields } from '@/types/contentful';
import { useRoute } from 'vue-router';

type ContentStore = Record<string, IPageFields | ContentfulEntryFields>;

export const useContentStore = defineStore('content', () => {
  const contentStore = ref<ContentStore>({});
  const isPreviewEnv = window.location.hostname.split('.')[0] === 'preview' || window.location.hostname === 'localhost';

  const getCache = (key: string): unknown => {
    const ttl = 24 * 60 * 60 * 1000; // 24h
    const cache = key in contentStore.value ? contentStore.value[key] : sessionStorage.getItem(key);
    if (cache) {
      let _data;
      if (typeof cache === 'string') {
        const _timestamp = JSON.parse(cache).timestamp;
        _data = JSON.parse(cache).data;
        if (Date.now() - _timestamp > ttl) {
          sessionStorage.removeItem(key);
          delete contentStore.value[key];
          return null;
        }
        contentStore.value[key] = _data;
      } else {
        _data = toRaw(cache);
      }
      return _data;
    }
    return null;
  };
  const setCache = (key: string, data: any): void => {
    contentStore.value[key] = data;
    sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  };

  // Get all data for a page, cache it, and serve the cache if it's there
  const getContentfulPage = async <T>(slug: string): Promise<FetchResponse<T>> => {
    const { getContent } = useRest();
    const cacheKey = `page-${slug}`;
    const cachedContent = getCache(cacheKey);
    if (!isPreviewEnv && cachedContent) {
      return {
        data: ref(cachedContent) as Ref<T | null>,
        pending: ref(false),
        success: ref(true),
        error: ref(''),
      };
    }

    const { data, pending, success, error } = await getContent<T>(`?content_type=page&fields.slug=${slug}&include=3`);

    if (success.value && data.value && !isPreviewEnv) {
      setCache(cacheKey, data.value);
    }
    return { data, pending, success, error };
  };

  // Get all data for a single entry, cache it, and serve the cache if it's there
  const getContentfulEntry = async <T>(entry: string): Promise<FetchResponse<T>> => {
    const { getContent } = useRest();
    const cacheKey = `entry-${entry}`;
    const cachedContent = getCache(cacheKey);
    if (!isPreviewEnv && cachedContent) {
      return {
        data: ref(cachedContent) as Ref<T | null>,
        pending: ref(false),
        success: ref(true),
        error: ref(''),
      };
    }

    const { data, pending, success, error } = await getContent<T>(`${entry}`);
    if (success.value && data.value && !isPreviewEnv) {
      setCache(cacheKey, data.value);
    }
    return { data, pending, success, error };
  };

  return {
    contentStore,
    getContentfulEntry,
    getContentfulPage,
  };
});
