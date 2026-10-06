// Serveur de dev local : fichiers statiques + /api/wind (même code que sur Vercel).
//   node server.mjs   → http://localhost:8765
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import wind from './api/wind.js';

const PORT = Number(process.env.PORT) || 8765;
const ROOT = new URL('.', import.meta.url).pathname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/api/wind') return wind(req, res);

  const file = normalize(join(ROOT, path === '/' ? 'index.html' : path));
  if (!file.startsWith(ROOT) || file.includes('/api/') || file.includes('/.')) { res.statusCode = 404; return res.end(); }
  try {
    const body = await readFile(file);
    res.setHeader('content-type', TYPES[extname(file)] ?? 'application/octet-stream');
    res.setHeader('cache-control', 'no-cache');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
}).listen(PORT, '127.0.0.1', () => console.log(`http://localhost:${PORT}`));
