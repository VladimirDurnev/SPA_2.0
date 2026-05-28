export type ThemeMode = 'dark' | 'light';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    background: {
      body: string;
    };
    surface: {
      base: string;
      elevated: string;
      muted: string;
      hover: string;
      active: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      base: string;
      strong: string;
    };
    status: {
      danger: string;
      warning: string;
      success: string;
      info: string;
    };
    chart: {
      stroke: string;
      hatchStroke: string;
    };
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    pill: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
