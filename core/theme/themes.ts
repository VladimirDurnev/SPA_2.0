import type { AppTheme, ThemeMode } from './types';

export const appThemes: Record<ThemeMode, AppTheme> = {
  dark: {
    mode: 'dark',
    colors: {
      background: {
        body: '#0a0a0a',
      },
      surface: {
        base: '#0d0d0d',
        elevated: '#141414',
        muted: '#1a1a1a',
        hover: '#1f1f1f',
        active: 'rgba(255, 255, 255, 0.08)',
      },
      text: {
        primary: '#f0f0f0',
        secondary: '#d9d9d9',
        muted: '#a6a6a6',
        inverse: '#ffffff',
      },
      border: {
        base: '#303030',
        strong: '#434343',
      },
      status: {
        danger: '#ff7875',
        warning: '#e67e22',
        success: '#2e7d32',
        info: '#29b6f6',
      },
      chart: {
        stroke: '#0d0d0d',
        hatchStroke: '#0d0d0d',
      },
    },
    radius: {
      sm: '2px',
      md: '8px',
      lg: '12px',
      pill: '999px',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },
  light: {
    mode: 'light',
    colors: {
      background: {
        body: '#f5f5f5',
      },
      surface: {
        base: '#ffffff',
        elevated: '#ffffff',
        muted: '#fafafa',
        hover: '#f0f0f0',
        active: 'rgba(0, 0, 0, 0.06)',
      },
      text: {
        primary: '#141414',
        secondary: '#333333',
        muted: '#6b7280',
        inverse: '#ffffff',
      },
      border: {
        base: '#d9d9d9',
        strong: '#bfbfbf',
      },
      status: {
        danger: '#cf1322',
        warning: '#d46b08',
        success: '#237804',
        info: '#1677ff',
      },
      chart: {
        stroke: '#ffffff',
        hatchStroke: '#ffffff',
      },
    },
    radius: {
      sm: '2px',
      md: '8px',
      lg: '12px',
      pill: '999px',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
  },
};
