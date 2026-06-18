/**
 * Селекторы virtual scroll: превращают Redux + scrollTop в окно строк для IncidentsTable.
 */
import type { RootState } from '@/app/store/types';

import { createSelector } from '@reduxjs/toolkit';
import {
  INCIDENTS_ROW_HEIGHT,
  INCIDENTS_VIRTUAL_OVERSCAN,
  INCIDENTS_VIRTUAL_WINDOW_SIZE,
} from '../constants';
import {
  getFlatRowCountFiltered,
  getFlatRowCountLazy,
  resolveFlatRowAtFiltered,
  resolveFlatRowAtLazy,
} from '../utils/flattenVisibleRows';
import { selectLazyFlatListContext } from './incidentsSelectors';

/** Объединяет lazy-контекст или filtered-дерево для `selectFlatRowAt` / `selectFlatRowCount` */
function buildFlatListContextFromState(state: RootState) {
  const lazyFlatListContext = selectLazyFlatListContext(state);

  if (lazyFlatListContext) {
    return {
      mode: 'lazy' as const,
      ...lazyFlatListContext,
    };
  }

  const incidentsState = state.incidents;

  return {
    mode: 'filtered' as const,
    items: incidentsState.filteredItems,
    expandedIds: incidentsState.expandedIds,
  };
}

/** Число строк в плоском списке (для высоты скроллбара: count × ROW_HEIGHT) */
export function selectFlatRowCount(state: RootState): number {
  const flatListContext = buildFlatListContextFromState(state);

  if (flatListContext.mode === 'filtered') {
    return getFlatRowCountFiltered({
      items: flatListContext.items,
      expandedIds: flatListContext.expandedIds,
    });
  }

  return getFlatRowCountLazy(flatListContext);
}

/** Строка по плоскому индексу: данные или placeholder, если chunk ещё не загружен */
export function selectFlatRowAt(state: RootState, flatRowIndex: number) {
  const flatListContext = buildFlatListContextFromState(state);

  if (flatListContext.mode === 'filtered') {
    return resolveFlatRowAtFiltered(flatRowIndex, {
      items: flatListContext.items,
      expandedIds: flatListContext.expandedIds,
    });
  }

  return resolveFlatRowAtLazy(flatRowIndex, flatListContext);
}

const selectScrollTop = (_state: RootState, scrollTop: number) => scrollTop;

/**
 * Главный селектор таблицы: по scrollTop возвращает
 * - `rows` — что реально отдать в Ant Table (~15–19 строк)
 * - `paddingTop` / `paddingBottom` — имитация невидимых строк сверху/снизу
 * - `firstVisibleFlatRowIndex` / `lastVisibleFlatRowIndex` — для ensureFlatRangeLoadedThunk
 */
export const selectVirtualWindow = createSelector(
  (state: RootState) => state,
  selectScrollTop,
  (state, scrollTop) => {
    const flatRowCount = selectFlatRowCount(state);
    const firstVisibleRowIndex = Math.floor(scrollTop / INCIDENTS_ROW_HEIGHT);
    const firstVisibleFlatRowIndex = Math.max(0, firstVisibleRowIndex - INCIDENTS_VIRTUAL_OVERSCAN);
    const lastVisibleFlatRowIndex = Math.min(
      flatRowCount - 1,
      firstVisibleRowIndex + INCIDENTS_VIRTUAL_WINDOW_SIZE + INCIDENTS_VIRTUAL_OVERSCAN - 1,
    );

    const virtualWindowRows = [];
    for (
      let flatRowIndex = firstVisibleFlatRowIndex;
      flatRowIndex <= lastVisibleFlatRowIndex;
      flatRowIndex += 1
    ) {
      const tableRow = selectFlatRowAt(state, flatRowIndex);
      if (tableRow) {
        virtualWindowRows.push({ flatRowIndex, tableRow });
      }
    }

    return {
      flatRowCount,
      firstVisibleFlatRowIndex,
      lastVisibleFlatRowIndex,
      paddingTop: firstVisibleFlatRowIndex * INCIDENTS_ROW_HEIGHT,
      paddingBottom: Math.max(0, (flatRowCount - lastVisibleFlatRowIndex - 1) * INCIDENTS_ROW_HEIGHT),
      rows: virtualWindowRows,
    };
  },
);

/** Таблица может рендерить строки: init прошёл или включён фильтр по бубликам */
export const selectIsTableReady = (state: RootState) =>
  state.incidents.isTableInitialized || state.incidents.tableMode === 'filtered';
