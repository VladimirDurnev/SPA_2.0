import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';

import type { OpenApiRouteDefinition } from './types';

function toRouteConfig(route: OpenApiRouteDefinition): RouteConfig {
  const responses = Object.fromEntries(
    Object.entries(route.responses).map(([status, response]) => [
      status,
      {
        description: response.description,
        content: {
          'application/json': {
            schema: response.schema,
          },
        },
      },
    ]),
  );

  return {
    method: route.method,
    path: route.path,
    tags: route.tags,
    summary: route.summary,
    description: route.description,
    operationId: route.operationId,
    request: route.request
      ? {
          query: route.request.query,
          params: route.request.params,
          body: route.request.body
            ? {
                required: true,
                content: {
                  'application/json': {
                    schema: route.request.body,
                  },
                },
              }
            : undefined,
        }
      : undefined,
    responses,
  };
}

export function registerOpenApiRoutes(
  registry: OpenAPIRegistry,
  routes: OpenApiRouteDefinition[],
): void {
  for (const route of routes) {
    registry.registerPath(toRouteConfig(route));
  }
}
