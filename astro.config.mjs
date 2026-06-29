import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { exec } from 'child_process';

const isBuild = process.argv.includes('build');

const gitAutoPush = () => ({
  name: 'git-auto-push',
  configureServer(server) {
    let timeout;
    server.watcher.on('all', (event, path) => {
      if (path.includes('/src/content/blog/')) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log(`\n[Auto-Push] Blog update detected! Pushing to GitHub...`);
          exec('git add src/content/blog/ && git commit -m "Auto-update blog via Keystatic" && git push origin main', (err, stdout, stderr) => {
             if (err && !stdout.includes('nothing to commit')) {
               console.error('[Auto-Push] Failed to push:', stderr);
             } else if (!err) {
               console.log('[Auto-Push] Successfully pushed to GitHub!');
             }
          });
        }, 3000);
      }
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