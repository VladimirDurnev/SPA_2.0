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
  build: {
    target: ['firefox115'],
  },
  resolve: {
    alias: {
      '@': path.resolve(appDir, 'src'),
      '@org/core': path.resolve(appDir, '../../core/index.ts'),
    },
  },
});

