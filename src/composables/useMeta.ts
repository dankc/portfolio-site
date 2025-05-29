declare let document: Document;
type MetaObject = Record<string, string>;

const head = document.head;

const standardTags = ['author', 'description', 'keywords', 'referrer', 'theme-color', 'color-scheme', 'viewport'];
const twitterTags = [
  'twitter:card',
  'twitter:domain',
  'twitter:url',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:image:alt',
];
const isName = (key: string) => [...standardTags, ...twitterTags].includes(key);

function setMetaProperty(key: string, value: string) {
  const meta = document.createElement('meta');
  meta.setAttribute('property', key);
  meta.setAttribute('content', value);
  head.appendChild(meta);
}
function setMetaName(key: string, value: string) {
  const meta = document.createElement('meta');
  meta.setAttribute('name', key);
  meta.setAttribute('content', value);
  head.appendChild(meta);
}

export const useMeta = () => {
  const setMeta = (metaObject: MetaObject): void => {
    Object.entries(metaObject).forEach(([key, value]) => {
      if (key === 'title') document[key] = value;
      if (isName(key)) {
        setMetaName(key, value);
      } else {
        setMetaProperty(key, value);
      }
    });
  };

  return {
    setMeta,
  };
};
