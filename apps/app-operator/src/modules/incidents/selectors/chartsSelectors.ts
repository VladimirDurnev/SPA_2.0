/**
 * Селекторы donut-графиков. Данные из `aggregates` (GET /aggregates), не из дерева таблицы.
 */
import type { DonutChartData } from '@org/core';
import type { RootState } from '@/app/store/types';
import { createSelector } from '@reduxjs/toolkit';

import {
  criticalityChartFromAggregates,
  durationChartFromAggregates,
  incidentStateChartFromAggregates,
} from '../utils/aggregateCharts';

const EMPTY_CHART: DonutChartData = {
  title: '',
  chartData: [],
  legendData: [],
};

const selectAggregates = (state: RootState) => state.incidents.aggregates;
const selectIsLoading = (state: RootState) => state.incidents.isLoading;

export const selectChartsReady = createSelector(
  selectAggregates,
  selectIsLoading,
  (aggregates, isLoading) => aggregates != null && !isLoading,
);

export const selectCriticalityChartData = createSelector(
  selectAggregates,
  (aggregates) => {
    if (!aggregates) {
      return EMPTY_CHART;
    }

    return criticalityChartFromAggregates(aggregates.criticality);
  },
);

export const selectIncidentStateChartData = createSelector(
  selectAggregates,
  (aggregates) => {
    if (!aggregates) {
      return EMPTY_CHART;
    }

    return incidentStateChartFromAggregates(aggregates.incidentState);
  },
);

export const selectDurationChartData = createSelector(
  selectAggregates,
  (aggregates) => {
    if (!aggregates) {
      return EMPTY_CHART;
    }

    return durationChartFromAggregates(aggregates.duration);
  },
);
