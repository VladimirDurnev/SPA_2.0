import type { ReactNode } from 'react';

import { styled } from '../../styled';

const Body = styled.div`
  align-items: center;
  display: flex;
  gap: 32px;
`;

interface DonutChartBodyProps {
  children: ReactNode;
}

export function DonutChartBody({ children }: DonutChartBodyProps) {
  return <Body>{children}</Body>;
}
