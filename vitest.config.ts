import { defineConfig } from 'vitest/config';

export default defineConfig({
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

