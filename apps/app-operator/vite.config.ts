import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const appDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: ['firefox115'],
  },
  resolve: {
    alias: {
      '@': path.resolve(appDir, 'src'),
      // dev: исходники core, иначе подтягивается устаревший core/dist без кликов легенды
      '@org/core': path.resolve(appDir, '../../core/index.ts'),
    },
  },
});

