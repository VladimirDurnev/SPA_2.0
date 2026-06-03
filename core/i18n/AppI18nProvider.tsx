import type { PropsWithChildren } from 'react';
import type { AppLocale, ModuleI18nResources } from './types';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { getSavedLocale, i18n, initI18n, saveLocale } from './instance';

interface AppI18nProviderProps extends PropsWithChildren {
  /** Локали feature-модулей (incidents, users, …) */
  modules?: ModuleI18nResources[];
}

interface LocaleContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Подключает i18next к React и хранит текущий язык приложения.
 *
 * `modules` — список локалей feature-модулей конкретного приложения.
 * Это позволяет `@org/core` знать только про общий `common`, а доменные
 * namespace-ы держать рядом с модулями.
 */
export function AppI18nProvider({ children, modules = [] }: AppI18nProviderProps) {
  const [ready, setReady] = useState(i18n.isInitialized);
  const [locale, setLocaleState] = useState<AppLocale>(getSavedLocale);

  useEffect(() => {
    void initI18n({ modules }).then(() => setReady(true));
  }, [modules]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    void i18n.changeLanguage(locale);
    saveLocale(locale);
  }, [locale, ready]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale: setLocaleState,
    toggleLocale: () => setLocaleState(current => (current === 'ru' ? 'en' : 'ru')),
  }), [locale]);

  if (!ready) {
    return null;
  }

  return (
    <LocaleContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </LocaleContext.Provider>
  );
}

/**
 * Возвращает текущий язык и методы его смены.
 *
 * Используется shared UI-компонентами вроде `LocaleToggle`.
 */
export function useAppLocale() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error('useAppLocale must be used inside AppI18nProvider');
  }

  return value;
}
