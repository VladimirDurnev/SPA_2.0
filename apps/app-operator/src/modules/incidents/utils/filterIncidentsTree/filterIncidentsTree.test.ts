import type { IncidentTreeNode } from '../../types';

import { describe, expect, it } from 'vitest';

import { filterTreeByCriticality } from '.';

const tree: IncidentTreeNode[] = [
  {
    id: 'block-1',
    name: 'Блок 1',
    children: [
      {
        id: 'tg-1',
        name: 'ТГ-1',
        criticality: 'high',
        incidentState: 'model',
      },
      {
        id: 'tg-2',
        name: 'ТГ-2',
        criticality: 'low',
        incidentState: 'sensor',
      },
    ],
  },
  {
    id: 'block-2',
    name: 'Блок 2',
    children: [
      {
        id: 'tg-3',
        name: 'ТГ-3',
        criticality: null,
        incidentState: 'equipment',
      },
    ],
  },
];

describe('filterTreeByCriticality', () => {
  it('keeps parent branches that contain a child with selected criticality', () => {
    expect(filterTreeByCriticality(tree, 'high')).toEqual([
      {
        id: 'block-1',
        name: 'Блок 1',
        children: [
          {
            id: 'tg-1',
            name: 'ТГ-1',
            criticality: 'high',
            incidentState: 'model',
          },
        ],
      },
    ]);
  });

  it('returns only incident rows without criticality for unspecified filter', () => {
    expect(filterTreeByCriticality(tree, 'unspecified')).toEqual([
      {
        id: 'block-2',
        name: 'Блок 2',
        children: [
          {
            id: 'tg-3',
            name: 'ТГ-3',
            criticality: null,
            incidentState: 'equipment',
          },
        ],
      },
    ]);
  });
});
