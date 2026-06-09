import type { IncidentsTreeResponse, IncidentTreeNode } from '../types';

import { z } from 'zod';

// Разрешённые значения критичности из API.
// Если бэк пришлёт, например, "critical" вместо "high" — Zod поймает ошибку.
export const IncidentCriticalitySchema = z
  .enum(['high', 'medium', 'low'])
  .meta({ description: 'Критичность инцидента.' });

// Разрешённые значения типа/состояния инцидента из API.
export const IncidentStateSchema = z
  .enum(['model', 'equipment', 'sensor'])
  .meta({ description: 'Тип/состояние инцидента в дереве.' });

// Схема одной строки дерева инцидентов.
// z.lazy нужен, потому что узел может содержать children с такими же узлами.
export const IncidentTreeNodeSchema: z.ZodType<IncidentTreeNode> = z.lazy(() =>
  z.object({
    // Обязательные поля: без id/name строку таблицы нельзя нормально отрисовать.
    id: z.string(),
    name: z.string(),

    // optional() — поле может вообще отсутствовать в JSON.
    cmState: z.literal('active').optional(),

    // nullable() — поле может быть null.
    // optional() — поле может отсутствовать.
    // Итого: разрешены "high" | "medium" | "low" | null | undefined.
    criticality: IncidentCriticalitySchema.nullable().optional(),

    // Разрешены "model" | "equipment" | "sensor" | null | undefined.
    // Это удобно для строк-групп, где состояния инцидента может не быть.
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

// Схема всего ответа GET /incidentsTree.
// Проверяем не только items, но и ключи раскрытия строк по умолчанию.
export const IncidentsTreeResponseSchema: z.ZodType<IncidentsTreeResponse> = z.object({
  items: z.array(IncidentTreeNodeSchema),
  defaultExpandedRowKeys: z.array(z.string()),
}).meta({ description: 'Ответ GET /incidentsTree.' });

// Единственная точка доверия к API-ответу.
// До этой функции data имеет тип unknown, после успешного parse — IncidentsTreeResponse.
export function parseIncidentsTreeResponse(data: unknown): IncidentsTreeResponse {
  return IncidentsTreeResponseSchema.parse(data);
}
