import type { OpenApiAppDefinition } from './types';

export const OPENAPI_APPS: Record<OpenApiAppDefinition['id'], OpenApiAppDefinition> = {
  operator: {
    id: 'operator',
    title: 'Kvant Detection Operator API',
    version: '0.1.0',
    description: 'Контракт API оператора: собран из Zod-схем фронтенда (npm run openapi:build).',
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
    description: 'Контракт API админки: собран из Zod-схем фронтенда (npm run openapi:build).',
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
    description: 'Контракт API эксперта: собран из Zod-схем фронтенда (npm run openapi:build).',
    outputFileName: 'expert.openapi.json',
    loadRoutes: async () => {
      const { openApiRoutes } = await import('../../apps/app-expert/src/openapi/index.ts');
      return openApiRoutes;
    },
  },
};
