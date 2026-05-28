import type { IncidentTreeNode } from '../../types';

import { describe, expect, it } from 'vitest';

import {
  aggregateCriticalityChart,
  aggregateDurationChart,
  aggregateIncidentStateChart,
} from '.';

const items: IncidentTreeNode[] = [
  {
    id: 'block-1',
    name: 'Блок 1',
    children: [
      {
        id: 'tg-1',
        name: 'ТГ-1',
        criticality: 'high',
        incidentState: 'model',
        durationDays: 4,
        totalIncidents: 3,
      },
      {
        id: 'tg-2',
        name: 'ТГ-2',
        criticality: 'medium',
        incidentState: 'sensor',
        durationDays: 24,
      },
    ],
  },
  {
    id: 'tg-3',
    name: 'ТГ-3',
    criticality: 'high',
    incidentState: 'model',
    durationDays: 60,
  },
];

describe('incident chart aggregators', () => {
  it('aggregates criticality and incident state across the whole tree', () => {
    expect(aggregateCriticalityChart(items).legendData).toMatchObject([
      { id: 'high', value: 4 },
      { id: 'medium', value: 1 },
      { id: 'low', value: 0 },
      { id: 'unspecified', value: 0 },
    ]);

    expect(aggregateIncidentStateChart(items).legendData).toMatchObject([
      { id: 'model', value: 4 },
      { id: 'equipment', value: 0 },
      { id: 'sensor', value: 1 },
    ]);
  });

  it('puts incidents into duration buckets', () => {
    expect(aggregateDurationChart(items).legendData).toMatchObject([
      { id: 'less-week', value: 3 },
      { id: 'weeks-1-2', value: 0 },
      { id: 'weeks-3-5', value: 1 },
      { id: 'weeks-6-8', value: 0 },
      { id: 'more-8', value: 1 },
    ]);
  });
});
