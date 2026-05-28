import type { AppLocale, ModuleI18nResources } from './types';

type I18nResourceTree = Record<AppLocale, Record<string, Record<string, unknown>>>;

/**
 * Склеивает namespace-ы core и feature-модулей в формат `resources` для i18next.
 *
 * На вход подаётся массив bundles:
 * `[{ common: ... }, { incidents: ... }, { users: ... }]`.
 * На выходе i18next получает дерево:
 * `{ ru: { common, incidents, users }, en: { common, incidents, users } }`.
 */
export function mergeI18nResources(
  modules: ModuleI18nResources[],
): I18nResourceTree {
  const merged: I18nResourceTree = { ru: {}, en: {} };

  const allModules = modules;

  for (const moduleBundle of allModules) {
    for (const [namespace, localeDict] of Object.entries(moduleBundle)) {
      for (const locale of ['ru', 'en'] as const) {
        merged[locale][namespace] = {
          ...(merged[locale][namespace] ?? {}),
          ...localeDict[locale],
        };
      }
    }
  }

  return merged;
}
