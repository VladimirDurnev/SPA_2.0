import { DonutChart, useTranslation } from '@org/core';
import { useMemo } from 'react';

import { useAppSelector } from '@/app/store/hooks';

import {
  selectChartsReady,
  selectDurationChartData,
} from '../../selectors/chartsSelectors';
import { translateDonutChartData } from '../../utils/translateChartData';

export function DurationDonutChart() {
  const { t, i18n } = useTranslation('incidents');
  const isReady = useAppSelector(selectChartsReady);
  const rawData = useAppSelector(selectDurationChartData);
  const data = useMemo(
    () => translateDonutChartData(rawData, t),
    [rawData, t, i18n.language],
  );

  if (!isReady) {
    return null;
  }

  return <DonutChart key="duration" {...data} />;
}
