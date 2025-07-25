// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Entry } from 'contentful';

export interface IButtonFields {
  /** Entry Title */
  entryTitle?: string | undefined;

  /** Text */
  text: string;

  /** URL */
  url: string;

  /** Tracking Tag */
  trackingTag?: string | undefined;
}

export interface IButton extends Entry<IButtonFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'button';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IDetailsFields {
  /** Heading */
  heading?: string | undefined;

  /** Section ID */
  sectionId: string;

  /** Paragraphs */
  paragraphs?: Record<string, any> | undefined;

  /** List */
  list?: string[] | undefined;

  /** Pills */
  pills?: IPillFields[] | undefined;
}

export interface IDetails extends Entry<IDetailsFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'details';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IHeroFields {
  /** Section ID */
  sectionId: string;

  /** Heading */
  heading?: string | undefined;

  /** Paragraph */
  paragraph?: string | undefined;

  /** Buttons */
  buttons?: IButtonFields[] | undefined;
}

export interface IHero extends Entry<IHeroFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'hero';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPackageSectionFields {
  /** Name */
  name: string;

  /** Description */
  description: string;

  /** Image */
  image?: string | undefined;

  /** Buttons */
  buttons?: IButtonFields[] | undefined;
}

export interface IPackageSection extends Entry<IPackageSectionFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'packageSection';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPageFields {
  /** Title */
  title: string;

  /** Slug */
  slug: string;

  /** Body */
  body: (IDetailsFields | IHeroFields | ISectionFields)[];
}

export interface IPage extends Entry<IPageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'page';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPillFields {
  /** Text */
  text?: string | undefined;

  /** Bg Color */
  bgColor?: string | undefined;

  /** Color */
  color?: string | undefined;
}

export interface IPill extends Entry<IPillFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'pill';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ISampleFields {
  /** Client */
  client?: string | undefined;

  /** Campaign */
  campaign?: string | undefined;

  /** Type */
  type?: string | undefined;

  /** Origin */
  origin?: string | undefined;

  /** Thumbnail */
  thumbnail: string;

  /** Src Sm */
  srcSm?: string | undefined;

  /** Src Md */
  srcMd?: string | undefined;

  /** Src Lg */
  srcLg: string;

  /** Alt Text */
  altText?: string | undefined;

  /** Width */
  width?: number | undefined;

  /** Height */
  height?: number | undefined;
}

/** Work/Project Sample */

export interface ISample extends Entry<ISampleFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'sample';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ISectionFields {
  /** Heading */
  heading?: string | undefined;

  /** Section ID */
  sectionId: string;

  /** Paragraphs */
  paragraphs?: Record<string, any> | undefined;

  /** List */
  list?: string[] | undefined;

  /** Buttons */
  buttons?: IButtonFields[] | undefined;

  /** Section Content List */
  sectionContentList?: (IPackageSectionFields | ISampleFields)[] | undefined;

  /** Sub Sections */
  subSections?: IDetailsFields[] | undefined;
}

/** Generic section */

export interface ISection extends Entry<ISectionFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'section';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export type CONTENT_TYPE = 'button' | 'details' | 'hero' | 'packageSection' | 'page' | 'pill' | 'sample' | 'section';

export type IEntry = IButton | IDetails | IHero | IPackageSection | IPage | IPill | ISample | ISection;

export type LOCALE_CODE = 'en-US';

export type CONTENTFUL_DEFAULT_LOCALE_CODE = 'en-US';
