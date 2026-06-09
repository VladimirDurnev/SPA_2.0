import type { z } from 'zod';

export type OpenApiHttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface OpenApiResponseDefinition {
  description: string;
  schema: z.ZodType;
}

export interface OpenApiRequestDefinition {
  query?: z.ZodObject;
  params?: z.ZodObject;
  body?: z.ZodType;
}

/** Описание одного HTTP-эндпоинта для генерации OpenAPI из Zod-схем. */
export interface OpenApiRouteDefinition {
  method: OpenApiHttpMethod;
  path: string;
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  request?: OpenApiRequestDefinition;
  responses: Record<number, OpenApiResponseDefinition>;
}

export type OpenApiAppId = 'operator' | 'admin' | 'expert';

export interface OpenApiAppDefinition {
  id: OpenApiAppId;
  title: string;
  version: string;
  description: string;
  outputFileName: string;
  loadRoutes: () => Promise<OpenApiRouteDefinition[]>;
}
