/** Запрет прямых импортов платформенных пакетов в apps (см. docs/DEPENDENCIES.md) */

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
  patterns: [
    {
      group: ['antd/*', 'axios/*', 'lodash/*', 'd3', 'd3/*', 'dayjs', 'jspdf', 'jszip'],
      message: 'Платформенные пакеты — только через @org/core (docs/DEPENDENCIES.md)',
    },
  ],
};

const restrictedRules = {
  'no-restricted-imports': ['error', restrictedOptions],
  '@typescript-eslint/no-restricted-imports': ['error', restrictedOptions],
};

export const appsImportRestrictions = [
  {
    name: 'spa2/apps-import-restrictions-ts',
    files: ['apps/**/src/**/*.ts'],
    rules: restrictedRules,
  },
  {
    name: 'spa2/apps-import-restrictions-tsx',
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
];
