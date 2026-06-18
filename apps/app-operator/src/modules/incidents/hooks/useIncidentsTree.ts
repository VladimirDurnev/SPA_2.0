import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import {
  fetchIncidentsAggregatesThunk,
  initIncidentsTableThunk,
} from '../api/incidentsThunks';

/**
 * Стартовая загрузка страницы /incidents.
 *
 * 1. `initIncidentsTableThunk` — первые 100 корней + total (скроллбар на весь список).
 * 2. `fetchIncidentsAggregatesThunk` — данные для бубликов.
 *
 * Вызывается один раз из IncidentsPage; повторно init не шлёт, пока `isTableInitialized`.
 */
export function useLoadIncidentsTree() {
  const dispatch = useAppDispatch();
  const isTableInitialized = useAppSelector(state => state.incidents.isTableInitialized);
  const tableMode = useAppSelector(state => state.incidents.tableMode);
  const aggregates = useAppSelector(state => state.incidents.aggregates);

  useEffect(() => {
    if (!isTableInitialized && tableMode === 'lazy') {
      void dispatch(initIncidentsTableThunk());
    }

    if (!aggregates) {
      void dispatch(fetchIncidentsAggregatesThunk());
    }
  }, [aggregates, dispatch, isTableInitialized, tableMode]);
}

/** Прямой доступ к slice `incidents` (для тестов и простых компонентов). */
export function useIncidentsTreeState() {
  return useAppSelector(state => state.incidents);
}
