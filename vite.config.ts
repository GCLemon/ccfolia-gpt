import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import path from 'path';

// Chrome拡張のマニフェスト
const manifest = defineManifest({
  manifest_version: 3,
  name: 'CCFOLIA GPT',
  version: '1.0.0',
  action: {},
  content_scripts: [{
    matches: ['https://ccfolia.com/rooms/*'],
    run_at: 'document_start',
    js: ['./src/content/index.ts']
  }],
  background: {
    service_worker: './src/background',
  },
  options_ui: {
    page: 'index.html',
  },
});

// Vite Configuration
export default defineConfig({
  plugins: [react(), crx({manifest})],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'src'),
    },
  },
});
