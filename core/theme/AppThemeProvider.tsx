import type { PropsWithChildren } from 'react';
import type { ThemeMode } from './types';

import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import ruRU from 'antd/locale/ru_RU';
import { createContext, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '../components/styled';

import { createAntdTheme } from './antdTheme';
import { GlobalStyles } from './GlobalStyles';
import { appThemes } from './themes';

const THEME_STORAGE_KEY = 'spa2-theme-mode';

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
}

const antdLocales = {
  ru: ruRU,
  en: enUS,
} as const;

export function AppThemeProvider({ children }: PropsWithChildren) {
  const { i18n } = useTranslation();
  const [mode, setModeState] = useState<ThemeMode>(getInitialThemeMode);
  const theme = appThemes[mode];
  const antdTheme = useMemo(() => createAntdTheme(theme), [theme]);
  const antdLocale = antdLocales[i18n.language as keyof typeof antdLocales] ?? ruRU;

  const value = useMemo<ThemeModeContextValue>(() => {
    const setMode = (nextMode: ThemeMode) => {
      setModeState(nextMode);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      }
    };

    return {
      mode,
      setMode,
      toggleMode: () => setMode(mode === 'dark' ? 'light' : 'dark'),
    };
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <ConfigProvider locale={antdLocale} theme={antdTheme}>
          <AntdApp>
            <GlobalStyles />
            {children}
          </AntdApp>
        </ConfigProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const value = useContext(ThemeModeContext);

  if (!value) {
    throw new Error('useThemeMode must be used inside AppThemeProvider');
  }

  return value;
}
