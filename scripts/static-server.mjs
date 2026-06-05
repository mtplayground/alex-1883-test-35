import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDir = resolve(rootDir, 'dist');
const host = process.env.HOST ?? '0.0.0.0';
const portText = process.env.PORT ?? '8080';
const port = Number.parseInt(portText, 10);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
]);

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    'content-length': Buffer.byteLength(body),
    'content-type': 'text/plain; charset=utf-8',
  });
  response.end(body);
}

function resolveStaticPath(requestUrl) {
  const url = new URL(requestUrl, 'http://localhost');
  const decodedPath = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(decodedPath).replace(
    /^(\.\.(?:\/|\\|$))+/,
    '',
  );
  const requestedPath = resolve(
    distDir,
    normalizedPath === sep ? 'index.html' : `.${normalizedPath}`,
  );

  if (
    requestedPath !== distDir &&
    !requestedPath.startsWith(`${distDir}${sep}`)
  ) {
    return null;
  }

  if (existsSync(requestedPath)) {
    const stats = statSync(requestedPath);
    return stats.isDirectory()
      ? join(requestedPath, 'index.html')
      : requestedPath;
  }

  return join(distDir, 'index.html');
}

function serveFile(response, filePath) {
  if (!existsSync(filePath)) {
    sendText(response, 404, 'Not found');
    return;
  }

  const stats = statSync(filePath);
  if (!stats.isFile()) {
    sendText(response, 404, 'Not found');
    return;
  }

  response.writeHead(200, {
    'cache-control': filePath.includes(`${sep}assets${sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
    'content-length': stats.size,
    'content-type':
      contentTypes.get(extname(filePath).toLowerCase()) ??
      'application/octet-stream',
  });

  createReadStream(filePath)
    .on('error', (error) => {
      console.error('Failed to stream static asset', error);
      if (!response.headersSent) {
        sendText(response, 500, 'Internal server error');
      } else {
        response.destroy(error);
      }
    })
    .pipe(response);
}

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  console.error(
    `Invalid PORT "${portText}". Expected an integer from 1 to 65535.`,
  );
  process.exitCode = 1;
} else if (!existsSync(join(distDir, 'index.html'))) {
  console.error(
    `Missing ${join(distDir, 'index.html')}. Run npm run build before npm start.`,
  );
  process.exitCode = 1;
} else {
  const server = createServer((request, response) => {
    if (!request.url) {
      sendText(response, 400, 'Bad request');
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, {
        allow: 'GET, HEAD',
        'content-length': 0,
      });
      response.end();
      return;
    }

    try {
      const filePath = resolveStaticPath(request.url);
      if (!filePath) {
        sendText(response, 403, 'Forbidden');
        return;
      }

      if (request.method === 'HEAD') {
        const stats = existsSync(filePath) ? statSync(filePath) : null;
        if (!stats?.isFile()) {
          sendText(response, 404, 'Not found');
          return;
        }

        response.writeHead(200, {
          'content-length': stats.size,
          'content-type':
            contentTypes.get(extname(filePath).toLowerCase()) ??
            'application/octet-stream',
        });
        response.end();
        return;
      }

      serveFile(response, filePath);
    } catch (error) {
      console.error('Static server request failed', error);
      sendText(response, 500, 'Internal server error');
    }
  });

  server.listen(port, host, () => {
    console.log(
      `Serving Suanpan dist from ${distDir} on http://${host}:${port}`,
    );
  });
}
