import type { RootState } from '@/app/store/types';
import { createSelector } from '@reduxjs/toolkit';

import {
  aggregateCriticalityChart,
  aggregateDurationChart,
  aggregateIncidentStateChart,
} from '../utils/aggregateCharts';

const selectAllItems = (state: RootState) => state.incidents.allItems;
const selectItems = (state: RootState) => state.incidents.items;
const selectIsLoading = (state: RootState) => state.incidents.isLoading;

/** Полное дерево для бубликов (не отфильтрованная таблица) */
const selectTreeForCharts = createSelector(
  selectAllItems,
  selectItems,
  (allItems, items) => (allItems.length > 0 ? allItems : items),
);

export const selectChartsReady = createSelector(
  selectTreeForCharts,
  selectIsLoading,
  (tree, isLoading) => tree.length > 0 && !isLoading,
);

export const selectCriticalityChartData = createSelector(
  selectTreeForCharts,
  aggregateCriticalityChart,
);

export const selectIncidentStateChartData = createSelector(
  selectTreeForCharts,
  aggregateIncidentStateChart,
);

export const selectDurationChartData = createSelector(
  selectTreeForCharts,
  aggregateDurationChart,
);
