import type { AppTheme } from './types';

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
