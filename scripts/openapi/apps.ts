import type { OpenApiAppDefinition } from './types';

export const OPENAPI_APPS: Record<OpenApiAppDefinition['id'], OpenApiAppDefinition> = {
  operator: {
    id: 'operator',
    title: 'Kvant Detection Operator API',
    version: '0.1.0',
    description: 'OpenAPI-контракт, сгенерированный из Zod-схем app-operator.',
    outputFileName: 'operator.openapi.json',
    loadRoutes: async () => {
      const { openApiRoutes } = await import('../../apps/app-operator/src/openapi/index.ts');
      return openApiRoutes;
    },
  },
  admin: {
    id: 'admin',
    title: 'Kvant Detection Admin API',
    version: '0.1.0',
    description: 'OpenAPI-контракт, сгенерированный из Zod-схем app-admin.',
    outputFileName: 'admin.openapi.json',
    loadRoutes: async () => {
      const { openApiRoutes } = await import('../../apps/app-admin/src/openapi/index.ts');
      return openApiRoutes;
    },
  },
  expert: {
    id: 'expert',
    title: 'Kvant Detection Expert API',
    version: '0.1.0',
    description: 'OpenAPI-контракт, сгенерированный из Zod-схем app-expert.',
    outputFileName: 'expert.openapi.json',
    loadRoutes: async () => {
      const { openApiRoutes } = await import('../../apps/app-expert/src/openapi/index.ts');
      return openApiRoutes;
    },
  },
};
