import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const appDir = path.dirname(fileURLToPath(import.meta.url));

function createBundleAnalyzers(mode: string) {
  if (mode !== 'analyze') {
    return [];
  }

  const sharedOptions = {
    brotliSize: true,
    gzipSize: true,
    open: false,
  };

  return [
    visualizer({
      ...sharedOptions,
      filename: 'dist/bundle-stats.html',
      template: 'list',
    }),
    visualizer({
      ...sharedOptions,
      filename: 'dist/bundle-stats-treemap.html',
      template: 'treemap',
    }),
    visualizer({
      ...sharedOptions,
      filename: 'dist/bundle-stats-sunburst.html',
      template: 'sunburst',
    }),
  ];
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    ...createBundleAnalyzers(mode),
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
}));
