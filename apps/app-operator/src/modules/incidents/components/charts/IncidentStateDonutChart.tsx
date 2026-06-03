import { DonutChart, useTranslation } from '@org/core';
import { useMemo } from 'react';

import { useAppSelector } from '@/app/store/hooks';

import {
  selectChartsReady,
  selectIncidentStateChartData,
} from '../../selectors/chartsSelectors';
import { translateDonutChartData } from '../../utils/translateChartData';

export function IncidentStateDonutChart() {
  const { t, i18n } = useTranslation('incidents');
  const isReady = useAppSelector(selectChartsReady);
  const rawData = useAppSelector(selectIncidentStateChartData);
  const data = useMemo(
    () => translateDonutChartData(rawData, t),
    [rawData, t, i18n.language],
  );

  if (!isReady) {
    return null;
  }

  return <DonutChart key="incident-state" {...data} />;
}
