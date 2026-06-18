import type { IncidentPlaceholderRow } from '../../types';

import { PlaceholderBar, PlaceholderCell } from './IncidentsTable.styles';

interface PlaceholderTableRowProps {
  row: IncidentPlaceholderRow;
  colSpan: number;
}

export function PlaceholderTableRow({ row, colSpan }: PlaceholderTableRowProps) {
  return (
    <tr data-row-key={row.id}>
      <PlaceholderCell colSpan={colSpan}>
        <PlaceholderBar $width={Math.max(80, 200 - row.depth * 20)} />
      </PlaceholderCell>
    </tr>
  );
}
