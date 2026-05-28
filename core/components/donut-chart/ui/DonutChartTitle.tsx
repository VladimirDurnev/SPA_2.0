import { styled } from '../../styled';

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
`;

interface DonutChartTitleProps {
  children: string;
}

export function DonutChartTitle({ children }: DonutChartTitleProps) {
  return <Title>{children}</Title>;
}
