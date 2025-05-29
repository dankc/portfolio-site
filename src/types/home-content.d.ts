import type {
  IHeroFields,
  IPackageSectionFields,
  IPageFields,
  ISampleFields,
  ISectionFields,
} from '@/types/contentful-generated-types';

type FeaturedPackages = ISectionFields & { sectionContentList: IPackageSectionFields[] };

type SampleSection = ISectionFields & { sectionContentList: ISampleFields[] };

interface HomePage extends Omit<IPageFields, 'body'> {
  body: Array<IHeroFields | FeaturedPackages | SampleSection | ISectionFields>;
}
interface HomePageData {
  heroData: IHeroFields;
  packagesData: FeaturedPackages;
  servicesData: ISectionFields;
  workData: SampleSection;
  aboutData: ISectionFields;
}

export { HomePage, HomePageData, FeaturedPackages, SampleSection, ISectionFields };
