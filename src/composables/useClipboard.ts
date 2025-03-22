export const useClipboard = () => {
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  return {
    copyToClipboard,
  };
};
