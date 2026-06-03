import type { RefObject } from 'react';
import type { PieArcDatum } from '../../../lib/d3/index.js';
import type { DonutChartSegment } from '../types';

import { useEffect } from 'react';
import { arc, pie, select } from '../../../lib/d3/index.js';

const SIZE = 200;
const INNER_RADIUS = 62;
const OUTER_RADIUS = 92;

export function useDonutChartSvg(
  svgRef: RefObject<SVGSVGElement | null>,
  chartData: DonutChartSegment[],
  instanceId = 'donut',
  options: { hatchStroke: string; stroke: string },
) {
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || chartData.length === 0) {
      return;
    }

    const svg = select(svgEl)
      .attr('viewBox', `0 0 ${SIZE} ${SIZE}`)
      .attr('width', SIZE)
      .attr('height', SIZE);

    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    chartData.forEach((segment) => {
      if (segment.pattern !== 'hatched') {
        return;
      }

      const pattern = defs
        .append('pattern')
        .attr('id', `hatch-${instanceId}-${segment.id}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 6)
        .attr('height', 6)
        .attr('patternTransform', 'rotate(-45)');

      pattern
        .append('rect')
        .attr('width', 6)
        .attr('height', 6)
        .attr('fill', segment.color);

      pattern
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 6)
        .attr('stroke', options.hatchStroke)
        .attr('stroke-width', 2);
    });

    const pieGenerator = pie<DonutChartSegment>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.01);

    const arcGenerator = arc<PieArcDatum<DonutChartSegment>>()
      .innerRadius(INNER_RADIUS)
      .outerRadius(OUTER_RADIUS);

    const g = svg
      .append('g')
      .attr('transform', `translate(${SIZE / 2}, ${SIZE / 2})`);

    g.selectAll('path')
      .data(pieGenerator(chartData.filter(d => d.value > 0)))
      .join('path')
      .attr('fill', d =>
        d.data.pattern === 'hatched'
          ? `url(#hatch-${instanceId}-${d.data.id})`
          : d.data.color)
      .attr('stroke', options.stroke)
      .attr('stroke-width', 1.5)
      .attr('d', arcGenerator);
  }, [chartData, instanceId, options.hatchStroke, options.stroke]);
}
