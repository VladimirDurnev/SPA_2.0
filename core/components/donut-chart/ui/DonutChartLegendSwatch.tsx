import type { DonutSegmentPattern } from '../types';
import { styled } from '../../styled';

const Swatch = styled.span<{ $color: string; $hatched?: boolean }>`
  background: ${({ $color, $hatched, theme }) =>
    $hatched
      ? `repeating-linear-gradient(
          -45deg,
          ${$color},
          ${$color} 2px,
          ${theme.colors.chart.hatchStroke} 2px,
          ${theme.colors.chart.hatchStroke} 4px
        )`
      : $color};
  border-radius: ${({ theme }) => theme.radius.sm};
  flex-shrink: 0;
  height: 14px;
  width: 14px;
`;

interface DonutChartLegendSwatchProps {
  color: string;
  pattern?: DonutSegmentPattern;
}

export function DonutChartLegendSwatch({ color, pattern }: DonutChartLegendSwatchProps) {
  return (
    <Swatch
      $color={color}
      $hatched={pattern === 'hatched'}
    />
  );
}
