import Links from '@/data/parsing-links.json';

type LinkShape = { [K: string]: string };
export type PlaceHolderValues = { [K: string]: any };

export const useParsePlaceholders = () => {
  const parseCopy = (copy: string, placeholderValues: PlaceHolderValues): string => {
    let parsedCopy = copy;
    const placeholders = copy.match(new RegExp(/\$\{\w+\}/, 'g')) || [];
    const getPlaceholderValue = (placeholder: string): string => {
      placeholder = placeholder.replace(new RegExp(/\$|\{|\}/, 'g'), '');
      return `${placeholderValues[placeholder]}`;
    };

    if (placeholders.length)
      placeholders.forEach((placeholder) => {
        parsedCopy = parsedCopy.replace(placeholder, getPlaceholderValue(placeholder));
      });

    return parsedCopy;
  };

  const parseLinks = (copy: string): string => {
    let parsedCopy = copy;
    const linkBlocks = copy.match(new RegExp(/\{\{\$\{\w+\}[\w|\s|\D]+\}\}/, 'g')) || [];

    if (linkBlocks.length)
      linkBlocks.forEach((linkBlock) => {
        const link: string = linkBlock.match(new RegExp(/\$\{\w+\}/))![0].replace(new RegExp(/[\$|\{|\}]/, 'g'), '');
        const url = (Links as LinkShape)[link];
        const cta = linkBlock.match(new RegExp(/(?<=\$\{\w+\})[\w|\s|\D]+(?=\}\})/));
        const anchor = `<a href="${url}" target="_blank" rel="noreferrer">${cta}</a>`;
        parsedCopy = parsedCopy.replace(linkBlock, url ? anchor : linkBlock);
      });
    return parsedCopy;
  };

  return {
    parseCopy,
    parseLinks,
  };
};
