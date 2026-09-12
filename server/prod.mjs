import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { loadEnv } from './env.mjs';
import { handleRsvp } from './rsvp.mjs';

loadEnv();

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, 'dist');
const PORT = Number(process.env.PORT || 5174);
const HOST = process.env.HOST || '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function safeFile(urlPath) {
  const clean = decodeURIComponent((urlPath || '/').split('?')[0]);
  const rel = clean === '/' ? '/index.html' : clean;
  const file = normalize(join(DIST, rel));
  if (!file.startsWith(DIST)) return null;
  if (existsSync(file) && statSync(file).isFile()) return file;
  const index = join(DIST, 'index.html');
  return existsSync(index) ? index : null;
}

const server = createServer((req, res) => {
  const url = req.url || '/';
  if (url.startsWith('/api/rsvp')) {
    handleRsvp(req, res);
    return;
  }

  const file = safeFile(url);
  if (!file) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }
  const type = TYPES[extname(file)] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  res.end(readFileSync(file));
});

server.listen(PORT, HOST, () => {
  console.log(`wedding invitation on http://${HOST}:${PORT}`);
});
