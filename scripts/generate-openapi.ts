import type { OpenApiAppId } from './openapi/types';

import process from 'node:process';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

import { z } from 'zod';
import { OPENAPI_APPS } from './openapi/apps';
import { generateOpenApiDocument } from './openapi/generate-document';

extendZodWithOpenApi(z);

const appArg = process.argv[2] as OpenApiAppId | undefined;

if (appArg && !(appArg in OPENAPI_APPS)) {
  console.error(`Unknown app "${appArg}". Use: operator | admin | expert`);
  process.exit(1);
}

const appsToGenerate = appArg
  ? [OPENAPI_APPS[appArg]]
  : Object.values(OPENAPI_APPS);

for (const app of appsToGenerate) {
  const outputPath = await generateOpenApiDocument(app);
  const routeCount = (await app.loadRoutes()).length;

  console.log(`OpenAPI document generated (${app.id}, ${routeCount} route(s)): ${outputPath}`);
}
