/** GET /incidentsTree — nested-дерево (фильтр по criticality) */
export const INCIDENTS_TREE_API = '/incidentsTree';

/** GET /incidentsTree/nodes — lazy-загрузка детей по parentId + offset/limit */
export const INCIDENTS_TREE_NODES_API = '/incidentsTree/nodes';

/** GET /incidentsTree/aggregates — агрегаты для бубликов без обхода дерева на клиенте */
export const INCIDENTS_TREE_AGGREGATES_API = '/incidentsTree/aggregates';

/** Ключ «виртуального корня» в store: дети уровня 0 (АЗС) */
export const INCIDENTS_ROOT_PARENT_ID = '__root__';

/** Размер одного chunk при запросе /nodes (offset кратен этому значению) */
export const INCIDENTS_PAGE_SIZE = 100;

/** Фиксированная высота строки для virtual scroll и paddingTop/Bottom */
export const INCIDENTS_ROW_HEIGHT = 48;

/** Сколько строк рендерить выше/ниже видимой области (буфер при быстром скролле) */
export const INCIDENTS_VIRTUAL_OVERSCAN = 4;

/** Сколько строк помещается в viewport (~520px / ROW_HEIGHT) */
export const INCIDENTS_VIRTUAL_WINDOW_SIZE = 11;

/** Пауза после scroll перед догрузкой chunk'ов (fallback, если нет scrollend) */
export const INCIDENTS_SCROLL_FETCH_DELAY_MS = 150;

/** Ширины колонок таблицы — единый источник для colgroup header/body */
export const INCIDENTS_TABLE_COLUMN_WIDTHS = {
  name: 280,
  cmState: 110,
  criticality: 170,
  incidentState: 180,
  malfunction: 220,
  deadline: 160,
  durationDays: 150,
  totalIncidents: 130,
  assigned: 100,
} as const;

/** Сумма width колонок — фиксированный scroll.x, чтобы header и body не расходились */
export const INCIDENTS_TABLE_SCROLL_X = Object.values(INCIDENTS_TABLE_COLUMN_WIDTHS)
  .reduce((totalWidth, columnWidth) => totalWidth + columnWidth, 0);
