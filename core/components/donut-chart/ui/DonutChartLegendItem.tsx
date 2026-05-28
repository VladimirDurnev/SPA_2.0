import type { DonutChartLegendItem as DonutChartLegendItemType } from '../types';
import { styled } from '../../styled';

import { DonutChartLegendSwatch } from './DonutChartLegendSwatch';

const Row = styled.li<{ $clickable?: boolean; $active?: boolean }>`
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  font-size: 13px;
  gap: 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  margin: 0 -4px;
  padding: 2px 4px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.surface.active : 'transparent'};

  &:hover {
    background: ${({ $clickable, $active, theme }) =>
      $clickable && !$active ? theme.colors.surface.hover : undefined};
  }
`;

const Label = styled.span`
  flex: 1;
  min-width: 0;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  min-width: 24px;
  text-align: right;
`;

interface DonutChartLegendItemProps {
  item: DonutChartLegendItemType;
  active?: boolean;
  onClick?: (item: DonutChartLegendItemType) => void;
}

export function DonutChartLegendItem({
  item,
  active = false,
  onClick,
}: DonutChartLegendItemProps) {
  const clickable = Boolean(onClick);

  const content = (
    <>
      <DonutChartLegendSwatch color={item.color} pattern={item.pattern} />
      <Label>{item.label}</Label>
      <Value>{item.value}</Value>
    </>
  );

  if (!clickable) {
    return <Row>{content}</Row>;
  }

  return (
    <Row
      $clickable
      $active={active}
      onClick={() => onClick?.(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(item);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {content}
    </Row>
  );
}
