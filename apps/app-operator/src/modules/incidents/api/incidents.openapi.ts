import type { OpenApiRouteDefinition } from '../../../../../../scripts/openapi/types';

import { z } from 'zod';

import {
  INCIDENTS_PAGE_SIZE,
  INCIDENTS_TREE_AGGREGATES_API,
  INCIDENTS_TREE_API,
  INCIDENTS_TREE_NODES_API,
} from '../constants';
import {
  IncidentCriticalitySchema,
  IncidentsAggregatesResponseSchema,
  IncidentsTreeResponseSchema,
  IncidentTreeNodesResponseSchema,
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
  {
    method: 'get',
    path: INCIDENTS_TREE_NODES_API,
    tags: ['Incidents'],
    summary: 'Получить диапазон дочерних узлов',
    operationId: 'getIncidentTreeNodes',
    request: {
      query: z.object({
        parentId: z.string().optional().meta({
          description:
            'ID родителя, чьих прямых детей запрашиваем. '
            + 'Не передавать — корневой уровень (АЗС). Пример: `r-0`.',
        }),
        offset: z.coerce.number().optional().meta({
          description:
            'Смещение среди детей родителя (с нуля). Для таблицы кратно размеру chunk (0, 100, 200…).',
        }),
        limit: z.coerce.number().optional().meta({
          description:
            `Сколько узлов вернуть за один запрос. В приложении — ${INCIDENTS_PAGE_SIZE}.`,
        }),
      }),
    },
    responses: {
      200: {
        description: 'Диапазон дочерних узлов.',
        schema: IncidentTreeNodesResponseSchema,
      },
    },
  },
  {
    method: 'get',
    path: INCIDENTS_TREE_AGGREGATES_API,
    tags: ['Incidents'],
    summary: 'Агрегаты для donut-графиков на странице инцидентов',
    description:
      'Сводные счётчики по всему дереву: критичность, состояние и длительность. '
      + 'Используются тремя бубликами над таблицей; не связан с lazy-загрузкой строк.',
    operationId: 'getIncidentsAggregates',
    responses: {
      200: {
        description: 'Данные для donut-графиков (критичность, состояние, длительность).',
        schema: IncidentsAggregatesResponseSchema,
      },
    },
  },
] satisfies OpenApiRouteDefinition[];
