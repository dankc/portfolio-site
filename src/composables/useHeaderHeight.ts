export const useHeaderHeight = () => {
  const getHeaderHeight = (target: HTMLElement) => {
    return target.offsetHeight;
  };

  return { getHeaderHeight };
};
