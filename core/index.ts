/**
 * Public API платформы @org/core
 *
 * В apps/*\/src импортируйте UI и утилиты только отсюда.
 * Версии пакетов — в корневом package.json → overrides.
 *
 * @see docs/DEPENDENCIES.md
 */

/** UI: antd и обёртки */
export * from './components/antd';

/** UI: donut-chart (d3) */
export * from './components/donut-chart';

/** UI: locale toggle */
export * from './components/locale-toggle';

/** Стили: styled-components */
export * from './components/styled';

/** UI: theme toggle */
export * from './components/theme-toggle';

/** i18n */
export * from './i18n/init';

/** API: axios */
export * from './lib/api';

/** Charts: d3 */
export { arc, pie, select } from './lib/d3';

export type { PieArcDatum } from './lib/d3';
/** Theme tokens and providers */
export * from './theme';
