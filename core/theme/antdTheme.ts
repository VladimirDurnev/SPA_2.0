import type { ThemeConfig } from 'antd';
import type { AppTheme } from './types';

import { theme as antdTheme } from 'antd';

export function createAntdTheme(theme: AppTheme): ThemeConfig {
  return {
    algorithm: theme.mode === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm,
    token: {
      colorBgBase: theme.colors.background.body,
      colorBgContainer: theme.colors.surface.elevated,
      colorBgElevated: theme.colors.surface.elevated,
      colorBorder: theme.colors.border.base,
      colorError: theme.colors.status.danger,
      colorInfo: theme.colors.status.info,
      colorPrimary: theme.colors.status.info,
      colorSuccess: theme.colors.status.success,
      colorText: theme.colors.text.primary,
      colorTextSecondary: theme.colors.text.secondary,
      colorWarning: theme.colors.status.warning,
      borderRadius: Number.parseInt(theme.radius.md, 10),
    },
    components: {
      Table: {
        rowHoverBg: theme.colors.surface.hover,
        headerBg: theme.colors.surface.muted,
        headerColor: theme.colors.text.muted,
        borderColor: theme.colors.border.base,
      },
      Tag: {
        defaultBg: theme.colors.surface.muted,
        defaultColor: theme.colors.text.primary,
      },
    },
  };
}
