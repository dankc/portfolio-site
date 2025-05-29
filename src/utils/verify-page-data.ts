import type { ComputedRef, Ref } from 'vue';
import { computed } from 'vue';
import type { IHeroFields, ISectionFields } from '@/types/contentful.d.ts';
import type { FeaturedPackages, SampleSection } from '@/types/home-content';

type SectionMapping<T> = {
  [K in keyof T]: {
    sectionId: string;
    typeGuard: (entry: any) => entry is T[K];
  };
};

const isHeroFields = (entry: any): entry is IHeroFields => 'heading' in entry;
const isFeaturedPackages = (entry: any): entry is FeaturedPackages =>
  'sectionContentList' in entry && entry.sectionContentList.some((item: any) => 'name' in item);
const isServicesSection = (entry: any): entry is ISectionFields =>
  'heading' in entry && !('packages' in entry) && 'list' in entry;
const isSampleSection = (entry: any): entry is SampleSection =>
  'sectionContentList' in entry && entry.sectionContentList.some((item: any) => 'client' in item);
const isAboutSection = (entry: any): entry is ISectionFields =>
  'heading' in entry && !('packages' in entry) && 'subSections' in entry;

function transformPageData<T extends { body?: any[] }, U extends Record<string, any>>(
  data: Ref<T | null>,
  sectionMapping: SectionMapping<U>
): ComputedRef<U> {
  return computed((): U => {
    const result: Partial<U> = {};

    const pageData = data.value;
    if (!pageData) {
      throw new Error('Page data is not available');
    }
    const body = pageData.body;
    if (!body) {
      throw new Error('Page body is not available');
    }

    for (const [key, { sectionId, typeGuard }] of Object.entries(sectionMapping) as [
      string,
      { sectionId: string; typeGuard: (entry: any) => boolean },
    ][]) {
      const entry = body.find((e: any) => e.sectionId === sectionId);
      if (!entry || !typeGuard(entry)) {
        throw new Error(`Section ${sectionId} not found or invalid type`);
      }
      result[key as keyof U] = entry;
    }

    return result as U;
  });
}

export {
  transformPageData,
  isHeroFields,
  isFeaturedPackages,
  isSampleSection,
  isServicesSection,
  isAboutSection,
  type SectionMapping,
};
