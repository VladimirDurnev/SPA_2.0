import type { TableColumnsType } from '@org/core';
import type { IncidentTableRow } from '../types';
import { useTranslation } from '@org/core';

import { useMemo } from 'react';
import {
  CmStateIndicator,
  CriticalityBadge,
  IncidentStateBadge,
  MalfunctionText,
  RowActions,
} from '../components/cellRenderers';
import { NameCell } from '../components/table/NameCell';
import { INCIDENTS_TABLE_COLUMN_WIDTHS } from '../constants';
import { isPlaceholderRow } from '../types';

export function useIncidentsTableColumns(): TableColumnsType<IncidentTableRow> {
  const { t } = useTranslation('incidents');

  return useMemo(
    () => [
      {
        title: t('table.columns.name'),
        key: 'name',
        dataIndex: 'name',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.name,
        ellipsis: true,
        render: (_, record) => <NameCell row={record} />,
      },
      {
        title: t('table.columns.cmState'),
        key: 'cmState',
        dataIndex: 'cmState',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.cmState,
        align: 'center',
        render: (_, record) =>
          !isPlaceholderRow(record) && record.cmState ? <CmStateIndicator /> : null,
      },
      {
        title: t('table.columns.criticality'),
        key: 'criticality',
        dataIndex: 'criticality',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.criticality,
        render: (_, record) =>
          !isPlaceholderRow(record) && record.criticality
            ? <CriticalityBadge value={record.criticality} />
            : null,
      },
      {
        title: t('table.columns.incidentState'),
        key: 'incidentState',
        dataIndex: 'incidentState',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.incidentState,
        render: (_, record) =>
          !isPlaceholderRow(record) && record.incidentState
            ? <IncidentStateBadge value={record.incidentState} />
            : null,
      },
      {
        title: t('table.columns.malfunction'),
        key: 'malfunction',
        dataIndex: 'malfunction',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.malfunction,
        ellipsis: true,
        render: (_, record) =>
          !isPlaceholderRow(record) && record.malfunction
            ? <MalfunctionText value={record.malfunction} />
            : null,
      },
      {
        title: t('table.columns.deadline'),
        key: 'deadline',
        dataIndex: 'deadline',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.deadline,
        render: (_, record) =>
          !isPlaceholderRow(record) ? record.deadline : null,
      },
      {
        title: t('table.columns.durationDays'),
        key: 'durationDays',
        dataIndex: 'durationDays',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.durationDays,
        align: 'center',
        render: (_, record) =>
          !isPlaceholderRow(record) ? record.durationDays : null,
      },
      {
        title: t('table.columns.totalIncidents'),
        key: 'totalIncidents',
        dataIndex: 'totalIncidents',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.totalIncidents,
        align: 'center',
        render: (_, record) =>
          !isPlaceholderRow(record) ? record.totalIncidents : null,
      },
      {
        title: t('table.columns.assigned'),
        key: 'assigned',
        width: INCIDENTS_TABLE_COLUMN_WIDTHS.assigned,
        align: 'center',
        render: (_, record) =>
          !isPlaceholderRow(record) && (record.malfunction || record.deadline)
            ? <RowActions />
            : null,
      },
    ],
    [t],
  );
}
