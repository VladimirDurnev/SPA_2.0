/**
 * Базовые селекторы slice `incidents` — единая точка чтения state для UI и thunk'ов.
 */
import type { LazyFlatListContext } from '../utils/flattenVisibleRows';
import type { ParentPageMeta } from '../utils/tableStore';
import type { RootState } from '@/app/store/types';

/** Весь slice `incidents` */
export const selectIncidentsState = (state: RootState) => state.incidents;

/** `lazy` — chunk'и /nodes; `filtered` — nested-дерево с бэка по клику на бублик */
export const selectIncidentsTableMode = (state: RootState) => state.incidents.tableMode;

/** Узел раскрыт → его дети входят в flat-список таблицы */
export const selectIsNodeExpanded = (state: RootState, nodeId: string) =>
  state.incidents.expandedIds.includes(nodeId);

/** hasChildren / loading для кнопки expand в NameCell */
export const selectNodeMeta = (state: RootState, nodeId: string) =>
  state.incidents.nodeMeta[nodeId];

/** total детей у родителя и какие offset/limit chunk'ов уже в store */
export const selectParentPageMeta = (
  state: RootState,
  parentId: string,
): ParentPageMeta | undefined => state.incidents.pageMetaByParent[parentId];

/**
 * Собирает поля store, нужные `flattenVisibleRows`.
 * @returns null в режиме `filtered` — там другой путь построения списка
 */
export function selectLazyFlatListContext(state: RootState): LazyFlatListContext | null {
  const incidentsState = state.incidents;

  if (incidentsState.tableMode === 'filtered') {
    return null;
  }

  return {
    nodes: incidentsState.nodes,
    pagesByParent: incidentsState.pagesByParent,
    pageMetaByParent: incidentsState.pageMetaByParent,
    expandedIds: incidentsState.expandedIds,
    nodeMeta: incidentsState.nodeMeta,
  };
}
