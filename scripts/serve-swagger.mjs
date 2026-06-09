import { createReadStream, existsSync } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = join(fileURLToPath(import.meta.url), '..', '..');
const SWAGGER_UI_DIR = join(ROOT_DIR, 'node_modules', 'swagger-ui-dist');
const API_DIR = join(ROOT_DIR, 'docs', 'api');
const HTML_PATH = join(ROOT_DIR, 'docs', 'swagger', 'index.html');
const PORT = Number(process.env.SWAGGER_PORT ?? 5179);
const MOCK_API_TARGET = process.env.SWAGGER_MOCK_API ?? 'http://localhost:3001';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function sendFile(response, filePath) {
  const extension = extname(filePath);
  const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';

  response.writeHead(200, { 'Content-Type': contentType });
  createReadStream(filePath).pipe(response);
}

function sendNotFound(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

async function proxyToMock(request, response) {
  const targetUrl = new URL(request.url ?? '/', MOCK_API_TARGET);
  const headers = { ...request.headers };
  delete headers.host;

  const init = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const chunks = [];

    for await (const chunk of request) {
      chunks.push(chunk);
    }

    init.body = Buffer.concat(chunks);
  }

  const proxyResponse = await fetch(targetUrl, init);

  response.writeHead(proxyResponse.status, Object.fromEntries(proxyResponse.headers));
  const body = await proxyResponse.arrayBuffer();
  response.end(Buffer.from(body));
}

async function resolveStaticPath(urlPath) {
  if (urlPath === '/' || urlPath === '/index.html') {
    return HTML_PATH;
  }

  if (urlPath.startsWith('/swagger-ui/')) {
    const relativePath = urlPath.slice('/swagger-ui/'.length);
    const filePath = normalize(join(SWAGGER_UI_DIR, relativePath));

    if (!filePath.startsWith(SWAGGER_UI_DIR)) {
      return null;
    }

    return filePath;
  }

  if (urlPath.startsWith('/api/')) {
    const relativePath = urlPath.slice('/api/'.length);
    const filePath = normalize(join(API_DIR, relativePath));

    if (!filePath.startsWith(API_DIR)) {
      return null;
    }

    return filePath;
  }

  return null;
}

const server = createServer(async (request, response) => {
  try {
    const urlPath = new URL(request.url ?? '/', `http://${request.headers.host}`).pathname;

    const filePath = await resolveStaticPath(urlPath);

    if (filePath && existsSync(filePath)) {
      const fileStat = await stat(filePath);

      if (fileStat.isFile()) {
        sendFile(response, filePath);
        return;
      }
    }

    await proxyToMock(request, response);
  }
  catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(error instanceof Error ? error.message : 'Internal server error');
  }
});

await access(HTML_PATH);
await access(SWAGGER_UI_DIR);

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} уже занят.`);
    console.error('Варианты:');
    console.error(`  1. Откройте уже запущенный Swagger: http://localhost:${PORT}`);
    console.error('  2. Остановите старый процесс (Ctrl+C в том терминале)');
    console.error('  3. Запустите на другом порту:');
    console.error('     set SWAGGER_PORT=5180 && npm run swagger:ui');
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Swagger UI: http://localhost:${PORT}`);
  console.log('API proxy:    unknown routes -> ' + MOCK_API_TARGET);
  console.log('Press Ctrl+C to stop');
});
