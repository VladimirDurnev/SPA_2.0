import type { IncidentCriticality, IncidentStateType } from '../../types';
import { useTranslation } from '@org/core';

import {
  ActionsButton,
  CmStateDot,
  CriticalityTag,
  IncidentStateTag,
  MalfunctionLabel,
} from './cellRenderers.styles';

const CRITICALITY_COLORS: Record<IncidentCriticality, string> = {
  high: '#5c1f1f',
  medium: '#4a3520',
  low: '#1f3d2a',
};

const INCIDENT_STATE_COLORS: Record<IncidentStateType, string> = {
  model: '#1a2d4a',
  equipment: '#2d1f4a',
  sensor: '#3d3d20',
};

export function CmStateIndicator() {
  const { t } = useTranslation('incidents');

  return <CmStateDot aria-label={t('a11y.cmStateActive')} />;
}

export function CriticalityBadge({ value }: { value: IncidentCriticality }) {
  const { t } = useTranslation('incidents');

  return (
    <CriticalityTag bordered={false} $background={CRITICALITY_COLORS[value]}>
      {t(`criticality.${value}`)}
    </CriticalityTag>
  );
}

export function IncidentStateBadge({ value }: { value: IncidentStateType }) {
  const { t } = useTranslation('incidents');

  return (
    <IncidentStateTag bordered={false} $background={INCIDENT_STATE_COLORS[value]}>
      {t(`incidentState.${value}`)}
    </IncidentStateTag>
  );
}

/** Текст неисправности с бэка; «Дисбаланс» подсвечивается по значению */
export function MalfunctionText({ value }: { value: string }) {
  return (
    <MalfunctionLabel $highlight={value === 'Дисбаланс' || value === 'Imbalance'}>
      {value}
    </MalfunctionLabel>
  );
}

export function RowActions() {
  const { t } = useTranslation('incidents');

  return (
    <ActionsButton type="button" aria-label={t('a11y.rowActions')}>
      ⋯
    </ActionsButton>
  );
}
