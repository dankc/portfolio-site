declare let document: Document;
type MetaObject = { [key: string]: string };

const xProperties = ['twitter:domain', 'twitter:url'];
const xNames = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
const head = document.head;

const isOg = (key: string) => key.startsWith('og:');
const isNotSocial = (key: string) =>
  key !== 'title' && !isOg(key) && !xNames.includes(`twitter:${key}`) && !xProperties.includes(`twitter:${key}`);

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
      if (isNotSocial(key) || (xNames.includes(key) && !xProperties.includes(key))) {
        setMetaName(key, value);
      }
      if (isOg(key) || (xProperties.includes(key) && !xNames.includes(key))) {
        setMetaProperty(key, value);
      }
    });
  };

  return {
    setMeta,
  };
};
