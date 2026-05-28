import type { DonutChartLegendItem, DonutChartSegment } from './types';

/** Сегменты кольца: значения и цвета синхронизируются с legendData по id */
export function resolveChartSegments(
  chartData: DonutChartSegment[],
  legendData: DonutChartLegendItem[],
): DonutChartSegment[] {
  const legendMap = new Map(legendData.map((item) => [item.id, item]));

  if (chartData.length > 0) {
    return chartData
      .map((segment) => {
        const legend = legendMap.get(segment.id);
        return {
          id: segment.id,
          value: Number(segment.value ?? legend?.value ?? 0),
          color: segment.color ?? legend?.color ?? '#888',
          pattern: segment.pattern ?? legend?.pattern,
        };
      })
      .filter((segment) => segment.value > 0);
  }

  return legendData
    .map((item) => ({
      id: item.id,
      value: Number(item.value),
      color: item.color,
      pattern: item.pattern,
    }))
    .filter((segment) => segment.value > 0);
}
