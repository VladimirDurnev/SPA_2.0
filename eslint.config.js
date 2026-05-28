import antfu from '@antfu/eslint-config';
import security from 'eslint-plugin-security';

import { appsImportRestrictions } from './eslint.apps-restrictions.mjs';

export default antfu(
  {
    type: 'app',
    ignores: ['**/*.md'],
    react: false,
    typescript: true,
    // Стилистика отдельно: в коде уже есть `;`, antfu по умолчанию — без `;` → сотни ложных ошибок
    stylistic: false,
  },
  {
    plugins: {
      security,
    },
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
  ...appsImportRestrictions,
);
