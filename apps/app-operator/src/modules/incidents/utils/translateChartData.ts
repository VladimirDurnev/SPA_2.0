import type { DonutChartData } from '@org/core';

/** Переводит title и legend labels бублика (в агрегации — i18n-ключи namespace incidents) */
export function translateDonutChartData(
  data: DonutChartData,
  t: (key: string) => string,
): DonutChartData {
  const legendData = data.legendData.map((item) => ({
    ...item,
    label: t(item.label),
  }));

  return {
    ...data,
    title: t(data.title),
    legendData,
    chartData: data.chartData,
  };
}
