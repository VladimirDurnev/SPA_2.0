import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = join(fileURLToPath(import.meta.url), '..', '..');
const OUTPUT_DIR = join(ROOT_DIR, 'docs', 'swagger', 'dist');

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(join(OUTPUT_DIR, 'api'), { recursive: true });
await mkdir(join(OUTPUT_DIR, 'swagger-ui'), { recursive: true });

await cp(join(ROOT_DIR, 'docs', 'swagger', 'index.html'), join(OUTPUT_DIR, 'index.html'));
await cp(join(ROOT_DIR, 'docs', 'api'), join(OUTPUT_DIR, 'api'), { recursive: true });
await cp(join(ROOT_DIR, 'node_modules', 'swagger-ui-dist'), join(OUTPUT_DIR, 'swagger-ui'), { recursive: true });

console.log(`Swagger static site built: ${OUTPUT_DIR}`);
