import type { ModuleI18nResources } from '@org/core';

import { incidentsI18nResources } from '@/modules/incidents/locales';

/**
 * Все module-level локали `app-operator`.
 *
 * Каждый новый feature-модуль добавляет сюда свой bundle локалей,
 * чтобы `AppI18nProvider` собрал их вместе с core namespace `common`.
 */
export const appI18nModules: ModuleI18nResources[] = [
  incidentsI18nResources,
];
