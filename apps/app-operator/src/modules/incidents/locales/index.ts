import type { ModuleI18nResources } from '@org/core';

import { incidentsEn } from './en';
import { incidentsRu } from './ru';

/**
 * Локали feature-модуля `incidents`.
 *
 * Namespace совпадает с именем модуля — `incidents`, поэтому компоненты
 * используют `useTranslation('incidents')`.
 */
export const incidentsI18nResources: ModuleI18nResources = {
  incidents: {
    ru: incidentsRu,
    en: incidentsEn,
  },
};
