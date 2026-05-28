/**
 * Только запрет прямых импортов платформы в apps.
 * npm run lint:apps-imports
 */
import tseslint from 'typescript-eslint';

const restrictedOptions = {
  paths: [
    {
      name: 'antd',
      message: 'UI только из @org/core. См. docs/DEPENDENCIES.md',
    },
    {
      name: 'axios',
      message: 'Используйте http из @org/core',
    },
    {
      name: 'lodash',
      message: 'Используйте утилиты из @org/core',
    },
    {
      name: 'styled-components',
      message: 'Стили платформы — через @org/core',
    },
  ],
};

const restrictedRules = {
  'no-restricted-imports': ['error', restrictedOptions],
  '@typescript-eslint/no-restricted-imports': ['error', restrictedOptions],
};

export default tseslint.config(
  tseslint.configs.base,
  {
    name: 'spa2/imports-only-ts',
    files: ['apps/**/src/**/*.ts'],
    rules: restrictedRules,
  },
  {
    name: 'spa2/imports-only-tsx',
    files: ['apps/**/src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: restrictedRules,
  },
);
