type IdString = string & { readonly match: `/^#[a-zA-Z0-9_-]+$/` };
interface Opts {
  offset?: number;
}

export const useScroll = () => {
  const _isReducedMotion: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollAnchor = (el: HTMLElement | IdString, options: Opts): void => {
    const { offset = 0 } = options;
    el = (typeof el === 'string' ? document.querySelector(el) : el) as HTMLElement;
    window.scrollTo({
      top: el.offsetTop + offset,
      behavior: _isReducedMotion ? 'auto' : 'smooth',
    });
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: _isReducedMotion ? 'auto' : 'smooth',
    });
  };

  return {
    scrollAnchor,
    scrollTop,
  };
};
