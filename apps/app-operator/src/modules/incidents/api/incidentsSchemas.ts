import type {
  IncidentsAggregatesResponse,
  IncidentsTreeResponse,
  IncidentTreeNode,
  IncidentTreeNodesResponse,
} from '../types';

import { z } from 'zod';

export const IncidentCriticalitySchema = z
  .enum(['high', 'medium', 'low'])
  .meta({ description: 'Критичность инцидента.' });

export const IncidentStateSchema = z
  .enum(['model', 'equipment', 'sensor'])
  .meta({ description: 'Тип/состояние инцидента в дереве.' });

const IncidentTreeNodeSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  hasChildren: z.boolean(),
  cmState: z.literal('active').optional(),
  criticality: IncidentCriticalitySchema.nullable().optional(),
  incidentState: IncidentStateSchema.nullable().optional(),
  malfunction: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  durationDays: z.number().nullable().optional(),
  totalIncidents: z.number().nullable().optional(),
  assigned: z.string().nullable().optional(),
}).meta({
  id: 'IncidentTreeNodeSummary',
  description: 'Узел дерева для lazy API.',
});

export const IncidentTreeNodeSchema: z.ZodType<IncidentTreeNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    cmState: z.literal('active').optional(),
    criticality: IncidentCriticalitySchema.nullable().optional(),
    incidentState: IncidentStateSchema.nullable().optional(),
    malfunction: z.string().nullable().optional(),
    deadline: z.string().nullable().optional(),
    durationDays: z.number().nullable().optional(),
    totalIncidents: z.number().nullable().optional(),
    assigned: z.string().nullable().optional(),
    children: z.array(IncidentTreeNodeSchema).optional(),
  }).meta({
    id: 'IncidentTreeNode',
    description: 'Строка дерева инцидентов.',
  }),
);

export const IncidentTreeNodesResponseSchema: z.ZodType<IncidentTreeNodesResponse> = z.object({
  parentId: z.string().nullable(),
  offset: z.number(),
  limit: z.number(),
  total: z.number(),
  items: z.array(IncidentTreeNodeSummarySchema),
}).meta({ description: 'Ответ GET /incidentsTree/nodes.' });

export const IncidentsAggregatesResponseSchema: z.ZodType<IncidentsAggregatesResponse> = z.object({
  totalNodes: z.number(),
  criticality: z.record(z.string(), z.number()),
  incidentState: z.record(z.string(), z.number()),
  duration: z.record(z.string(), z.number()),
}).meta({ description: 'Ответ GET /incidentsTree/aggregates — данные для donut-графиков на /incidents.' });

export const IncidentsTreeResponseSchema: z.ZodType<IncidentsTreeResponse> = z.object({
  items: z.array(IncidentTreeNodeSchema),
  defaultExpandedRowKeys: z.array(z.string()),
}).meta({ description: 'Ответ GET /incidentsTree.' });

export function parseIncidentsTreeResponse(data: unknown): IncidentsTreeResponse {
  return IncidentsTreeResponseSchema.parse(data);
}

export function parseIncidentTreeNodesResponse(data: unknown): IncidentTreeNodesResponse {
  return IncidentTreeNodesResponseSchema.parse(data);
}

export function parseIncidentsAggregatesResponse(data: unknown): IncidentsAggregatesResponse {
  return IncidentsAggregatesResponseSchema.parse(data);
}
