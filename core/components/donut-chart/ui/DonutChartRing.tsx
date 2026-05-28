import { forwardRef } from 'react';

import { styled } from '../../styled';

const ChartWrap = styled.div`
  flex-shrink: 0;
  height: 200px;
  position: relative;
  width: 200px;
`;

const ChartSvg = styled.svg`
  display: block;
`;

const CenterTotal = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 28px;
  font-weight: 700;
  left: 50%;
  line-height: 1;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

interface DonutChartRingProps {
  total: number;
}

export const DonutChartRing = forwardRef<SVGSVGElement, DonutChartRingProps>(
  ({ total }, ref) => {
    return (
      <ChartWrap>
        <ChartSvg ref={ref} aria-hidden />
        <CenterTotal>{total}</CenterTotal>
      </ChartWrap>
    );
  },
);
