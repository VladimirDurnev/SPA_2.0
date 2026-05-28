import type { InitI18nOptions } from './types';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { coreI18nResources } from './coreResources';
import { mergeI18nResources } from './mergeResources';

const LOCALE_STORAGE_KEY = 'spa2-locale';

let initialized = false;

/**
 * Возвращает сохранённый язык приложения.
 *
 * На сервере/в тестах без `window` возвращаем `ru`, чтобы i18n
 * имел стабильный fallback без доступа к browser API.
 */
export function getSavedLocale(): 'ru' | 'en' {
  if (typeof window === 'undefined') {
    return 'ru';
  }

  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return saved === 'en' ? 'en' : 'ru';
}

/**
 * Сохраняет выбранный язык между перезагрузками страницы.
 *
 * Функция безопасна для окружений без `window`.
 */
export function saveLocale(locale: 'ru' | 'en') {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

/**
 * Инициализирует singleton `i18next`.
 *
 * Core всегда подключает namespace `common`, а приложение передаёт локали
 * feature-модулей через `options.modules`. Повторный вызов не переинициализирует
 * i18next и возвращает уже готовый instance.
 */
export async function initI18n(options: InitI18nOptions = {}) {
  if (initialized) {
    return i18n;
  }

  const resources = mergeI18nResources([
    coreI18nResources,
    ...(options.modules ?? []),
  ]);

  const namespaces = Object.keys(resources.ru);

  await i18n.use(initReactI18next).init({
    resources,
    lng: getSavedLocale(),
    fallbackLng: 'ru',
    defaultNS: 'common',
    ns: namespaces,
    interpolation: { escapeValue: false },
  });

  initialized = true;
  return i18n;
}

export { i18n };
