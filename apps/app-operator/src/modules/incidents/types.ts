export type IncidentCriticality = 'high' | 'medium' | 'low';

export type IncidentStateType = 'model' | 'equipment' | 'sensor';

export interface IncidentsTreeResponse {
  items: IncidentTreeNode[];
  /** Раскрытие по умолчанию при первой загрузке (с бэка, без обхода дерева на клиенте) */
  defaultExpandedRowKeys: string[];
}

export interface IncidentTreeNode {
  id: string;
  name: string;
  /** Индикатор активности ЦМ в таблице */
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
