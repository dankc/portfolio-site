// Importing these to export all Contentful types from one place
import type {
  IButtonFields,
  IDetailsFields,
  IHeroFields,
  IPackageSectionFields,
  IPageFields,
  IPillFields,
  ISampleFields,
  ISectionFields,
} from './contentful-generated-types';

type ExtendedPageFields = Omit<IPageFields, 'body'> & {
  body: (IHero | ISection | IPackage | ISample | IDetails | IPill | IButton)[];
};

interface ContentfulSys {
  type: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  locale?: string;
  revision?: number;
  [key: string]: unknown;
}

interface ContentfulMetadata {
  tags: Array<{ sys: ContentfulSys }>;
  concepts?: unknown[];
  [key: string]: unknown;
}

interface ContentfulEntry {
  sys: ContentfulSys;
  metadata: ContentfulMetadata;
  fields: Record<string, unknown>;
}

type FlattenableValue = string | number | boolean | null | undefined | FlattenableObject | FlattenableArray;

interface FlattenableObject {
  [key: string]: FlattenableValue;
}

type FlattenableArray = Array<FlattenableValue>;

export type {
  ContentfulEntry,
  ExtendedPageFields,
  FlattenableValue,
  FlattenableArray,
  FlattenableObject,
  // Generated Interfaces
  IButtonFields,
  IDetailsFields,
  IHeroFields,
  IPackageSectionFields,
  IPageFields,
  IPillFields,
  ISampleFields,
  ISectionFields,
};
