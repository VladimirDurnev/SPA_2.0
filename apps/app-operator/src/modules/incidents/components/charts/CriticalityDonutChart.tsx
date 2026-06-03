import type { DonutChartLegendItem } from '@org/core';
import type { CriticalityFilterValue } from '../../utils/filterIncidentsTree';
import { DonutChart, useTranslation } from '@org/core';

import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchIncidentsByCriticalityThunk } from '../../api/incidentsThunks';
import {
  selectChartsReady,
  selectCriticalityChartData,
} from '../../selectors/chartsSelectors';
import { clearCriticalityFilter } from '../../store/incidentsSlice';
import { translateDonutChartData } from '../../utils/translateChartData';

export function CriticalityDonutChart() {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('incidents');
  const isReady = useAppSelector(selectChartsReady);
  const rawData = useAppSelector(selectCriticalityChartData);
  const data = useMemo(
    () => translateDonutChartData(rawData, t),
    [rawData, t, i18n.language],
  );
  const activeFilter = useAppSelector(state => state.incidents.criticalityFilter);

  const handleLegendClick = (item: DonutChartLegendItem) => {
    const filter = item.id as CriticalityFilterValue;

    if (activeFilter === filter) {
      dispatch(clearCriticalityFilter());
      return;
    }

    void dispatch(fetchIncidentsByCriticalityThunk(filter));
  };

  if (!isReady) {
    return null;
  }

  return (
    <DonutChart
      key="criticality"
      {...data}
      activeLegendId={activeFilter}
      onLegendItemClick={handleLegendClick}
    />
  );
}
