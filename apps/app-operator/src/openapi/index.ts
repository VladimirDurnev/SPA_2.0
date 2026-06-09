import type { OpenApiRouteDefinition } from '../../../../scripts/openapi/types';

import { incidentsOpenApiRoutes } from '../modules/incidents/api/incidents.openapi';

/** Все OpenAPI-маршруты app-operator. Добавляйте сюда экспорты из *.openapi.ts модулей. */
export const openApiRoutes: OpenApiRouteDefinition[] = [
  ...incidentsOpenApiRoutes,
];
