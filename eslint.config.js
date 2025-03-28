import pluginVue from 'eslint-plugin-vue';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),

  skipFormatting,

  {
    plugins: {
      '@stylistic/ts': stylisticTs,
    },
    rules: {
      '@/operator-linebreak': ['warn', 'before'],
    },
  },

  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
