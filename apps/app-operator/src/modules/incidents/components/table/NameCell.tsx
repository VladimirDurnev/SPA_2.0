import type { IncidentTableRow } from '../../types';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import { toggleExpandNodeThunk } from '../../api/incidentsThunks';
import { isPlaceholderRow } from '../../types';
import { ExpandButton, NameCellRoot, NameText } from './IncidentsTable.styles';

const INDENT_PX = 20;

interface NameCellProps {
  row: IncidentTableRow;
}

/** Колонка «Название»: отступ по depth + кнопка expand → toggleExpandNodeThunk */
export function NameCell({ row }: NameCellProps) {
  const dispatch = useAppDispatch();
  const expandedIds = useAppSelector(state => state.incidents.expandedIds);
  const nodeMeta = useAppSelector(state => state.incidents.nodeMeta);

  if (isPlaceholderRow(row)) {
    return (
      <NameCellRoot $depth={row.depth}>
        <NameText $muted>…</NameText>
      </NameCellRoot>
    );
  }

  const isExpanded = expandedIds.includes(row.id);
  const hasChildren = row.hasChildren || nodeMeta[row.id]?.hasChildren;
  const isLoading = nodeMeta[row.id]?.loading;

  const handleToggle = () => {
    if (!hasChildren || isLoading) {
      return;
    }

    void dispatch(toggleExpandNodeThunk(row.id));
  };

  return (
    <NameCellRoot $depth={row.depth}>
      {hasChildren
        ? (
            <ExpandButton
              type="button"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              onClick={handleToggle}
              disabled={isLoading}
            >
              {isLoading ? '…' : isExpanded ? '−' : '+'}
            </ExpandButton>
          )
        : (
            <span style={{ width: 22, display: 'inline-block' }} />
          )}
      <NameText>{row.name}</NameText>
    </NameCellRoot>
  );
}

export { INDENT_PX };
