import type { TableColumnsType } from '@org/core';
import type { IncidentTreeNode } from '../types';
import { useTranslation } from '@org/core';

import { useMemo } from 'react';
import {
  CmStateIndicator,
  CriticalityBadge,
  IncidentStateBadge,
  MalfunctionText,
  RowActions,
} from '../components/cellRenderers';

export function useIncidentsTableColumns(): TableColumnsType<IncidentTreeNode> {
  const { t } = useTranslation('incidents');

  return useMemo(
    () => [
      {
        title: t('table.columns.name'),
        dataIndex: 'name',
        key: 'name',
        width: 280,
        ellipsis: true,
      },
      {
        title: t('table.columns.cmState'),
        key: 'cmState',
        width: 110,
        align: 'center',
        render: (_, record) => (record.cmState ? <CmStateIndicator /> : null),
      },
      {
        title: t('table.columns.criticality'),
        key: 'criticality',
        width: 170,
        render: (_, record) =>
          record.criticality ? <CriticalityBadge value={record.criticality} /> : null,
      },
      {
        title: t('table.columns.incidentState'),
        key: 'incidentState',
        width: 180,
        render: (_, record) =>
          record.incidentState ? <IncidentStateBadge value={record.incidentState} /> : null,
      },
      {
        title: t('table.columns.malfunction'),
        dataIndex: 'malfunction',
        key: 'malfunction',
        width: 220,
        ellipsis: true,
        render: (value: string | null) =>
          value ? <MalfunctionText value={value} /> : null,
      },
      {
        title: t('table.columns.deadline'),
        dataIndex: 'deadline',
        key: 'deadline',
        width: 160,
      },
      {
        title: t('table.columns.durationDays'),
        dataIndex: 'durationDays',
        key: 'durationDays',
        width: 150,
        align: 'center',
      },
      {
        title: t('table.columns.totalIncidents'),
        dataIndex: 'totalIncidents',
        key: 'totalIncidents',
        width: 130,
        align: 'center',
      },
      {
        title: t('table.columns.assigned'),
        key: 'assigned',
        width: 100,
        align: 'center',
        render: (_, record) =>
          record.malfunction || record.deadline ? <RowActions /> : null,
      },
    ],
    [t],
  );
}
