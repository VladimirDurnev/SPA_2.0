export type IncidentCriticality = 'high' | 'medium' | 'low';

export type IncidentStateType = 'model' | 'equipment' | 'sensor';

export interface IncidentTreeNodeSummary {
  id: string;
  name: string;
  hasChildren: boolean;
  cmState?: 'active';
  criticality?: IncidentCriticality | null;
  incidentState?: IncidentStateType | null;
  malfunction?: string | null;
  deadline?: string | null;
  durationDays?: number | null;
  totalIncidents?: number | null;
  assigned?: string | null;
}

export interface IncidentTreeNodesResponse {
  parentId: string | null;
  offset: number;
  limit: number;
  total: number;
  items: IncidentTreeNodeSummary[];
}

export interface IncidentsAggregatesResponse {
  totalNodes: number;
  criticality: Record<string, number>;
  incidentState: Record<string, number>;
  duration: Record<string, number>;
}

export interface IncidentNodeMeta {
  hasChildren: boolean;
  childTotal?: number;
  loaded?: boolean;
  loading?: boolean;
}

export type IncidentsTableMode = 'lazy' | 'filtered';

export interface IncidentVisibleRow extends IncidentTreeNodeSummary {
  depth: number;
}

export interface IncidentPlaceholderRow {
  id: string;
  isPlaceholder: true;
  depth: number;
  parentId: string;
  siblingOffset: number;
}

export type IncidentTableRow = IncidentVisibleRow | IncidentPlaceholderRow;

export function isPlaceholderRow(row: IncidentTableRow): row is IncidentPlaceholderRow {
  return 'isPlaceholder' in row && row.isPlaceholder === true;
}

export interface IncidentsTreeResponse {
  items: IncidentTreeNode[];
  defaultExpandedRowKeys: string[];
}

export interface IncidentTreeNode {
  id: string;
  name: string;
  cmState?: 'active';
  criticality?: IncidentCriticality | null;
  incidentState?: IncidentStateType | null;
  malfunction?: string | null;
  deadline?: string | null;
  durationDays?: number | null;
  totalIncidents?: number | null;
  assigned?: string | null;
  children?: IncidentTreeNode[];
}
