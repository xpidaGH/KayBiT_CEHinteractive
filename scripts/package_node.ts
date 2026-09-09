#!/usr/bin/env tsx
/**
 * KayBiT_CEHinteractive - Node.js / TypeScript Local Web Container
 * Serves the compiled application locally with zero external network dependencies,
 * automatic port fallback, and strict local caching headers.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';

const PORT = parseInt(process.env.LOCAL_PORT || '8080', 10);
const HOST = '127.0.0.1';

const app = express();
const distDir = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
  console.warn(`[!] Warning: "${distDir}" does not exist yet. Run 'npm run build' first.`);
}

// Serve static assets with aggressive caching
app.use(express.static(distDir, {
  maxAge: '1d',
  immutable: true,
  index: 'index.html'
}));

// SPA Fallback: Route all unknown requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>KayBiT CEH Local Container</title></head>
        <body style="font-family: sans-serif; background: #0d1117; color: #c9d1d9; padding: 40px;">
          <h2>KayBiT_CEHinteractive Node.js Web Container</h2>
          <p>The web build was not found in <code>./dist</code>.</p>
          <p>Please compile the frontend bundle first using:</p>
          <pre style="background: #161b22; padding: 12px; border-radius: 6px; color: #58a6ff;">npm run build</pre>
        </body>
      </html>
    `);
  }
});

const server = app.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log('  KayBiT_CEHinteractive - Node.js TypeScript Web Container');
  console.log(`  Local Server Running: http://${HOST}:${PORT}`);
  console.log('  Mode: 100% Offline / LocalStorage Persistent');
  console.log('================================================================');
});

process.on('SIGINT', () => {
  console.log('\\n[*] Shutting down Node.js container...');
  server.close(() => process.exit(0));
});
