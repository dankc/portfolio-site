declare let document: Document;

type MetaObject = { [key: string]: string };
const ogProps = ['description', 'title', 'image'];

export const useMeta = () => {
  const setMeta = (metaObject: MetaObject): void => {
    const head = document.head;

    Object.entries(metaObject).forEach(([key, value]) => {
      if (key === 'title') document[key] = value;
      if (key !== 'title' && key !== 'image') {
        const meta = document.createElement('meta');
        meta.setAttribute('name', key);
        meta.setAttribute('content', value);
        head.appendChild(meta);
      }
      if (ogProps.includes(key)) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', `og:${key}`);
        meta.setAttribute('content', value);
        head.appendChild(meta);
      }
    });
  };

  return {
    setMeta,
  };
};
