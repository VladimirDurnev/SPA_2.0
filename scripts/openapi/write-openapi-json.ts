import type { OpenApiAppDefinition } from './types';
import { mkdir, writeFile } from 'node:fs/promises';

import { dirname, resolve } from 'node:path';

import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerOpenApiRoutes } from './register-routes';

const DOCS_API_DIR = resolve(import.meta.dirname, '../../docs/api');

/** Собирает OpenAPI 3 JSON из Zod-маршрутов приложения и записывает в docs/api/. */
export async function writeOpenApiJson(app: OpenApiAppDefinition): Promise<string> {
  const registry = new OpenAPIRegistry();
  const routes = await app.loadRoutes();

  registerOpenApiRoutes(registry, routes);

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: app.title,
      version: app.version,
      description: app.description,
    },
    servers: [
      {
        url: '/',
        description: 'Тот же хост, что и фронтенд',
      },
    ],
  });

  const outputPath = resolve(DOCS_API_DIR, app.outputFileName);

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

  return outputPath;
}
