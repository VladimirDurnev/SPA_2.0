import type { DonutChartData } from '@org/core';

import type {
  IncidentCriticality,
  IncidentStateType,
  IncidentTreeNode,
} from '../../types';

const CARD_STYLE = { padding: '12px 14px' } as const;

interface BucketMeta {
  label: string;
  color: string;
  pattern?: 'hatched';
}

/**
 * Сколько инцидентов «весит» узел в бублике.
 * Берём `totalIncidents` из JSON (как колонка «Инцидентов всего»), иначе 1.
 */
function incidentCount(node: IncidentTreeNode) {
  return node.totalIncidents ?? 1;
}

/**
 * Обходит дерево `incidentsTree` целиком — родители и все `children`.
 *
 * @param nodes — корень или поддерево
 * @param collect — что взять с узла для группировки (`high`, `model`, корзина по дням…).
 *                `null` — узел пропускаем (у блока нет критичности, только у ТГ).
 * @param totals — накопленные суммы по ключам
 */
function walkTree(
  nodes: IncidentTreeNode[],
  collect: (node: IncidentTreeNode) => string | null,
  totals: Record<string, number>,
) {
  for (const node of nodes) {
    const key = collect(node);
    if (key) {
      totals[key] = (totals[key] ?? 0) + incidentCount(node);
    }
    if (node.children?.length) {
      walkTree(node.children, collect, totals);
    }
  }
}

/**
 * Собирает ответ для `DonutChart`: легенда + сегменты кольца из накопленных `totals`.
 */
function buildChart(
  title: string,
  order: string[],
  meta: Record<string, BucketMeta>,
  totals: Record<string, number>,
): DonutChartData {
  const legendData = order.map(id => ({
    id,
    label: meta[id]?.label ?? id,
    value: totals[id] ?? 0,
    color: meta[id]?.color ?? '#888',
    pattern: meta[id]?.pattern,
  }));

  const chartData = legendData
    .filter(item => item.value > 0)
    .map(item => ({
      id: item.id,
      value: item.value,
      color: item.color,
      pattern: item.pattern,
    }));

  return { title, cardStyle: CARD_STYLE, chartData, legendData };
}

const CRITICALITY_META: Record<IncidentCriticality | 'unspecified', BucketMeta> = {
  high: { label: 'charts.criticality.high', color: '#d32f2f' },
  medium: { label: 'charts.criticality.medium', color: '#ff9800' },
  low: { label: 'charts.criticality.low', color: '#2e7d32' },
  unspecified: { label: 'charts.criticality.unspecified', color: '#757575' },
};

const CRITICALITY_ORDER: Array<IncidentCriticality | 'unspecified'> = [
  'high',
  'medium',
  'low',
  'unspecified',
];

export function aggregateCriticalityChart(items: IncidentTreeNode[]): DonutChartData {
  const totals: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0,
    unspecified: 0,
  };

  walkTree(items, node => node.criticality ?? null, totals);

  return buildChart(
    'charts.criticality.title',
    CRITICALITY_ORDER,
    CRITICALITY_META,
    totals,
  );
}

const INCIDENT_STATE_META: Record<IncidentStateType, BucketMeta> = {
  model: { label: 'charts.incidentState.model', color: '#ec407a' },
  equipment: { label: 'charts.incidentState.equipment', color: '#29b6f6' },
  sensor: { label: 'charts.incidentState.sensor', color: '#5c6bc0' },
};

const INCIDENT_STATE_ORDER: IncidentStateType[] = ['model', 'equipment', 'sensor'];

export function aggregateIncidentStateChart(items: IncidentTreeNode[]): DonutChartData {
  const totals: Record<string, number> = {
    model: 0,
    equipment: 0,
    sensor: 0,
  };

  walkTree(items, node => node.incidentState ?? null, totals);

  return buildChart(
    'charts.incidentState.title',
    INCIDENT_STATE_ORDER,
    INCIDENT_STATE_META,
    totals,
  );
}

type DurationBucketId
  = | 'less-week'
    | 'weeks-1-2'
    | 'weeks-3-5'
    | 'weeks-6-8'
    | 'more-8';

const DURATION_META: Record<DurationBucketId, BucketMeta> = {
  'less-week': { label: 'charts.duration.lessWeek', color: '#1b5e20' },
  'weeks-1-2': { label: 'charts.duration.weeks12', color: '#388e3c' },
  'weeks-3-5': { label: 'charts.duration.weeks35', color: '#66bb6a' },
  'weeks-6-8': { label: 'charts.duration.weeks68', color: '#dce775' },
  'more-8': { label: 'charts.duration.more8', color: '#d32f2f' },
};

const DURATION_ORDER: DurationBucketId[] = [
  'less-week',
  'weeks-1-2',
  'weeks-3-5',
  'weeks-6-8',
  'more-8',
];

function durationBucket(days: number): DurationBucketId {
  if (days < 7) {
    return 'less-week';
  }
  if (days < 21) {
    return 'weeks-1-2';
  }
  if (days < 36) {
    return 'weeks-3-5';
  }
  if (days < 57) {
    return 'weeks-6-8';
  }
  return 'more-8';
}

export function aggregateDurationChart(items: IncidentTreeNode[]): DonutChartData {
  const totals: Record<string, number> = {
    'less-week': 0,
    'weeks-1-2': 0,
    'weeks-3-5': 0,
    'weeks-6-8': 0,
    'more-8': 0,
  };

  walkTree(
    items,
    node =>
      node.durationDays == null ? null : durationBucket(node.durationDays),
    totals,
  );

  return buildChart(
    'charts.duration.title',
    DURATION_ORDER,
    DURATION_META,
    totals,
  );
}
