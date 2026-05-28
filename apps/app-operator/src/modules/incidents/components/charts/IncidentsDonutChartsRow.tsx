import { styled } from '@org/core';

import { CriticalityDonutChart } from './CriticalityDonutChart';
import { DurationDonutChart } from './DurationDonutChart';
import { IncidentStateDonutChart } from './IncidentStateDonutChart';

const Row = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export function IncidentsDonutChartsRow() {
  return (
    <Row>
      <CriticalityDonutChart />
      <IncidentStateDonutChart />
      <DurationDonutChart />
    </Row>
  );
}
