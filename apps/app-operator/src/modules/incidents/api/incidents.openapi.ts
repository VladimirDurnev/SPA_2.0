import type { OpenApiRouteDefinition } from '../../../../../../scripts/openapi/types';

import { z } from 'zod';

import { INCIDENTS_TREE_API } from '../constants';
import {
  IncidentCriticalitySchema,
  IncidentsTreeResponseSchema,
} from './incidentsSchemas';

export const incidentsOpenApiRoutes = [
  {
    method: 'get',
    path: INCIDENTS_TREE_API,
    tags: ['Incidents'],
    summary: 'Получить дерево инцидентов',
    description: 'Возвращает строки дерева инцидентов и ключи раскрытия строк по умолчанию.',
    operationId: 'getIncidentsTree',
    request: {
      query: z.object({
        criticality: IncidentCriticalitySchema.optional().meta({
          description: 'Фильтр дерева по критичности инцидента.',
        }),
      }),
    },
    responses: {
      200: {
        description: 'Дерево инцидентов.',
        schema: IncidentsTreeResponseSchema,
      },
    },
  },
] satisfies OpenApiRouteDefinition[];
