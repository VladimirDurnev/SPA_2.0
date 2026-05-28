import type { PropsWithChildren } from 'react';
import { AppI18nProvider, AppThemeProvider } from '@org/core';
import { useMemo } from 'react';
import { Provider } from 'react-redux';

import { appI18nModules } from './i18n/modules';
import { store } from './store';

export function AppProviders({ children }: PropsWithChildren) {
  const modules = useMemo(() => appI18nModules, []);

  return (
    <Provider store={store}>
      <AppI18nProvider modules={modules}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </AppI18nProvider>
    </Provider>
  );
}
