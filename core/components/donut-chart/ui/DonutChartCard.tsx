import type { ReactNode } from 'react';
import type { DonutChartCardStyle } from '../types';

import { styled } from '../../styled';

const DEFAULT_CARD_STYLE: Required<DonutChartCardStyle> = {
  background: '',
  borderRadius: '',
  padding: '16px 20px',
};

const Root = styled.section<{
  $background: string;
  $borderRadius: string;
  $padding: string;
}>`
  background: ${({ $background, theme }) =>
    $background || theme.colors.surface.elevated};
  border-radius: ${({ $borderRadius, theme }) =>
    $borderRadius || theme.radius.md};
  padding: ${({ $padding }) => $padding};
`;

interface DonutChartCardProps {
  children: ReactNode;
  cardStyle?: DonutChartCardStyle | false;
}

export function DonutChartCard({ children, cardStyle }: DonutChartCardProps) {
  if (cardStyle === false) {
    return <>{children}</>;
  }

  const resolved = { ...DEFAULT_CARD_STYLE, ...cardStyle };

  return (
    <Root
      $background={resolved.background}
      $borderRadius={resolved.borderRadius}
      $padding={resolved.padding}
    >
      {children}
    </Root>
  );
}

export const donutChartCardPresets = {
  default: undefined,
  compact: {
    padding: '12px 14px',
  } satisfies DonutChartCardStyle,
  plain: false as const,
};
