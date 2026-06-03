import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/app-operator/src'),
      '@org/core': path.resolve(__dirname, 'core/index.ts'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/apps',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      include: ['apps/*/src/**/*.{ts,tsx}'],
      exclude: [
        'apps/*/src/**/*.test.{ts,tsx}',
        'apps/*/src/**/*.spec.{ts,tsx}',
        'apps/*/src/**/__e2e__/**',
        'apps/*/src/**/*.styles.ts',
        'apps/*/src/**/styles.ts',
        'apps/*/src/**/locales/**',
        'apps/*/src/**/*.types.ts',
        'apps/*/src/**/types.ts',
        'apps/*/src/app/index.tsx',
      ],
    },
    environment: 'node',
    exclude: ['**/__e2e__/**', '**/node_modules/**'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
  },
});
