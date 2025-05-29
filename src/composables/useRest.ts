import { ref, type Ref } from 'vue';
import resolveResponse from 'contentful-resolve-response';
import { flattenAllFields } from '@/utils/flatten-contentful-data.ts';

export interface FetchResponse<T> {
  data: Ref<T | null>;
  pending: Ref<boolean>;
  success: Ref<boolean>;
  error: Ref<string>;
}
interface BaseFetchOptions {
  headers?: HeadersInit;
  method?: string;
  body?: string;
}

export const useRest = () => {
  const baseFetch = async (path: string = '', options?: BaseFetchOptions): Promise<Response> => {
    options = {
      method: 'GET',
      ...options,
    };
    const headers = new Headers({
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
    });
    if (import.meta.env.DEV) headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');

    const fetchOptions: RequestInit = {
      headers,
      mode: 'same-origin',
      ...options,
    };
    if (import.meta.env.DEV) fetchOptions.mode = 'cors';

    const url = `/api/${path}`;
    return await fetch(url, fetchOptions);
  };

  const getContent = async <T>(query: string = ''): Promise<FetchResponse<T>> => {
    const pending = ref(true);
    const response = await baseFetch(`content-rest${query}`);
    const json = await response.json();

    let content = resolveResponse(json.data);
    // Single entries aren't in an items array - resolveResponse will return an empty one
    content = flattenAllFields(content.length ? content : [json.data]);
    pending.value = false;

    return {
      data: ref(content[0] || null),
      pending,
      success: ref(json.success),
      error: ref(!json.success ? json.error : ''),
    } as FetchResponse<T>;
  };

  return { baseFetch, getContent };
};
