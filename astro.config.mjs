import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { exec } from 'child_process';

const isBuild = process.argv.includes('build');

const gitAutoPush = () => ({
  name: 'git-auto-push',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/__push-to-github' && req.method === 'POST') {
        console.log(`\n[Manual-Push] Button clicked! Pushing to GitHub...`);
        exec('git add -A && git commit -m "Manual update via Keystatic dashboard" && git push origin main', (err, stdout, stderr) => {
          res.setHeader('Content-Type', 'application/json');
          if (err && !stdout.includes('nothing to commit')) {
            console.error('[Manual-Push] Failed:', stderr);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: stderr }));
          } else {
            console.log('[Manual-Push] Successfully pushed to GitHub!');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          }
        });
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), gitAutoPush()]
  },
  integrations: [
    react(),
    ...(!isBuild ? [keystatic()] : [])
  ]
});