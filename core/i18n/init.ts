export { AppI18nProvider, useAppLocale } from './AppI18nProvider';
export { getSavedLocale, i18n, initI18n, saveLocale } from './instance';
export { mergeI18nResources } from './mergeResources';
export type {
  AppLocale,
  InitI18nOptions,
  ModuleI18nResources,
  ModuleNamespaceResources,
} from './types';

export { useTranslation } from 'react-i18next';
