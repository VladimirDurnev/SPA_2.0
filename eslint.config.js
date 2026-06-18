import antfu from '@antfu/eslint-config';
import security from 'eslint-plugin-security';

import { appsImportRestrictions } from './eslint.apps-restrictions.mjs';

export default antfu(
  {
    type: 'app',
    ignores: ['**/*.md'],
    react: false,
    typescript: true,
    // В IDE и в терминале одинаковая строгость (иначе antfu смягчает часть правил в редакторе).
    isInEditor: false,
    // Стилистика: semi: true — как в проекте (с `;`). Без semi antfu даёт сотни ложных ошибок.
    stylistic: {
      semi: true,
    },
  },
  {
    plugins: {
      security,
    },
    rules: {
      'security/detect-object-injection': 'off',
      'style/no-multi-spaces': 'error',
      // Стрелочные export const для селекторов и простых хелперов
      'antfu/top-level-function': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    rules: {
      'style/semi': 'off',
    },
  },
  ...appsImportRestrictions,
);
