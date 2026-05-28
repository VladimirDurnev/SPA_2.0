import type { DonutChartLegendItem as DonutChartLegendItemType } from '../types';
import { styled } from '../../styled';

import { DonutChartLegendItem as DonutChartLegendItemRow } from './DonutChartLegendItem';

const Legend = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  min-width: 0;
  padding: 0;
`;

interface DonutChartLegendProps {
  items: DonutChartLegendItemType[];
  activeLegendId?: string | null;
  onLegendItemClick?: (item: DonutChartLegendItemType) => void;
}

export function DonutChartLegend({
  items,
  activeLegendId = null,
  onLegendItemClick,
}: DonutChartLegendProps) {
  return (
    <Legend>
      {items.map((item) => (
        <DonutChartLegendItemRow
          key={item.id}
          item={item}
          active={activeLegendId === item.id}
          onClick={onLegendItemClick}
        />
      ))}
    </Legend>
  );
}
