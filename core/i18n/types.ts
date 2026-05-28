/** Языки, поддерживаемые приложениями SPA 2.0. */
export type AppLocale = 'ru' | 'en';

/**
 * Ресурсы одного namespace.
 *
 * Пример: namespace `incidents` содержит словари `ru` и `en`.
 */
export type ModuleNamespaceResources = Record<AppLocale, Record<string, unknown>>;

/**
 * Набор i18n namespace-ов, который отдаёт feature-модуль.
 *
 * Обычно у одного модуля один namespace:
 * `{ incidents: { ru: incidentsRu, en: incidentsEn } }`.
 */
export type ModuleI18nResources = Record<string, ModuleNamespaceResources>;

export interface InitI18nOptions {
  /** Локали feature-модулей приложения, которые добавляются к core `common`. */
  modules?: ModuleI18nResources[];
}
