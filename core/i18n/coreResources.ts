import type { ModuleI18nResources } from './types';
import { commonEn } from './locales/en/common';
import { commonRu } from './locales/ru/common';

/**
 * Платформенные строки `@org/core`.
 *
 * Здесь лежат только общие тексты shared UI: переключатели, общая навигация,
 * подписи, которые не принадлежат конкретному feature-модулю.
 */
export const coreI18nResources: ModuleI18nResources = {
  common: {
    ru: commonRu,
    en: commonEn,
  },
};
