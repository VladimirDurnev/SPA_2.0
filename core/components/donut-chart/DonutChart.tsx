import type { DonutChartProps } from './types';
import { useId, useRef } from 'react';

import { useTheme } from '../styled';
import { useDonutChartSvg } from './hooks/useDonutChartSvg';
import { resolveChartSegments } from './resolveChartSegments';
import { DonutChartBody } from './ui/DonutChartBody';
import { DonutChartCard } from './ui/DonutChartCard';
import { DonutChartLegend } from './ui/DonutChartLegend';
import { DonutChartRing } from './ui/DonutChartRing';
import { DonutChartTitle } from './ui/DonutChartTitle';

export function DonutChart({
  title,
  chartData,
  legendData,
  cardStyle,
  onLegendItemClick,
  activeLegendId = null,
}: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();
  // useId() даёт :r1: — двоеточия ломают url(#id) в SVG, все кольца рисовались одинаково
  const chartInstanceId = useId().replace(/:/g, '');
  const segments = resolveChartSegments(chartData, legendData);
  const total = segments.reduce((sum, item) => sum + item.value, 0);

  useDonutChartSvg(svgRef, segments, chartInstanceId, {
    hatchStroke: theme.colors.chart.hatchStroke,
    stroke: theme.colors.chart.stroke,
  });

  return (
    <DonutChartCard cardStyle={cardStyle}>
      <DonutChartTitle>{title}</DonutChartTitle>
      <DonutChartBody>
        <DonutChartRing ref={svgRef} total={total} />
        <DonutChartLegend
          items={legendData}
          activeLegendId={activeLegendId}
          onLegendItemClick={onLegendItemClick}
        />
      </DonutChartBody>
    </DonutChartCard>
  );
}
