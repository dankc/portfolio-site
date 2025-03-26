declare let document: Document;
type MetaObject = { [key: string]: string };

const xProperties = ['domain', 'url'];
const xNames = ['card', 'title', 'description', 'image'];
const head = document.head;

const isOg = (key: string) => key.startsWith('og:');
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
      if ((key !== 'title' && !isOg(key)) || xNames.includes(key)) {
        setMetaName(key, value);
      }
      if (isOg(key) || xProperties.includes(key)) {
        setMetaProperty(key, value);
      }
    });
  };

  return {
    setMeta,
  };
};
