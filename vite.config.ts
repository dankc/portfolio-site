import type { CompilerError } from '@vue/compiler-core/dist/compiler-core.d.ts';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import stylelint from 'vite-plugin-stylelint';
import autoprefixer from 'autoprefixer';
import postCssNested from 'postcss-nested';
import banner from 'vite-plugin-banner';
import { federation } from '@module-federation/vite';

const isDev = process.env.NODE_ENV === 'development';
const buildDateTime = new Date().toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
  timeZone: 'UTC',
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          onWarn: (warning: CompilerError) => void console.warn(warning),
          onError: (error: CompilerError) => void console.warn(error),
        },
      },
    }),
    vueDevTools(),
    stylelint({
      include: ['src/**/*.{css,vue}'],
      lintOnStart: true,
      emitError: true, // Treat warnings as errors in terminal
    }),
    ViteImageOptimizer({
      svg: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                cleanupIds: false,
                convertColors: false,
                convertPathData: false,
                inlineStyles: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
            },
          },
        ],
      },
    }),
    banner(`/*** Built on ${buildDateTime} ***/`),
    federation({
      name: 'vue_app_host',
      remotes: {
        react_app: {
          entry:
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:4173/remoteEntry.js'
              : '/crypto-tracker-app/remoteEntry.js',
          type: 'module',
          name: 'react_app',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [postCssNested, autoprefixer],
    },
  },
  build: {
    target: 'esnext',
    minify: !isDev,
    cssMinify: !isDev,
  },
  esbuild: {
    drop: isDev ? [] : ['console', 'debugger'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
