import type { OpenApiAppId } from './openapi/types';

import process from 'node:process';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import { z } from 'zod';
import { OPENAPI_APPS } from './openapi/apps';
import { writeOpenApiJson } from './openapi/write-openapi-json';

extendZodWithOpenApi(z);

const appArg = process.argv[2] as OpenApiAppId | undefined;

if (appArg && !(appArg in OPENAPI_APPS)) {
  console.error(`Неизвестное приложение "${appArg}". Допустимо: operator | admin | expert`);
  process.exit(1);
}

const appsToBuild = appArg
  ? [OPENAPI_APPS[appArg]]
  : Object.values(OPENAPI_APPS);

for (const app of appsToBuild) {
  const outputPath = await writeOpenApiJson(app);
  const routeCount = (await app.loadRoutes()).length;

  console.log(`OpenAPI-спека записана (${app.id}, маршрутов: ${routeCount}): ${outputPath}`);
}
