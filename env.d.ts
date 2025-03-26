/// <reference types="vite/cliet" />
declare module 'vue-matomo';

declare global {
  interface Window {
    _paq: {
      push(args: string[]): void;
    };
  }
}
