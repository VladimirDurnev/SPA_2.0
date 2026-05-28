import { defineConfig, devices } from '@playwright/test';

/**
 * Целевой браузер продукта: Firefox 115 ESR (Astra Linux).
 * Сборка: vite `build.target: ['firefox115']`.
 *
 * Playwright Firefox — ближайший автоматический прогон в CI/на dev-машине.
 * Финальную проверку на Astra делаем отдельно (ручной smoke / контур Astra).
 */
const appTargets = [
  {
    name: 'operator',
    port: 5173,
    testDir: 'apps/app-operator/src/modules',
    workspace: 'app-operator',
  },
  {
    name: 'admin',
    port: 5174,
    testDir: 'apps/app-admin/src/modules',
    workspace: 'app-admin',
  },
  {
    name: 'expert',
    port: 5175,
    testDir: 'apps/app-expert/src/modules',
    workspace: 'app-expert',
  },
] as const;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  reporter: 'list',
  globalTeardown: './playwright.global-teardown.cjs',
  snapshotPathTemplate: '{testDir}/{testFileDir}/screens/{arg}-{projectName}{ext}',
  webServer: [
    {
      command: 'npm run mock:server',
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: true,
    },
    ...appTargets.map(({ port, workspace }) => ({
      command: `npm run -w ${workspace} dev -- --host 127.0.0.1 --port ${port} --strictPort`,
      url: `http://127.0.0.1:${port}`,
      reuseExistingServer: true,
    })),
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: appTargets.map(({ name, port, testDir }) => ({
    name: `${name}-firefox`,
    testDir,
    testMatch: /__e2e__\/.*\.spec\.ts/,
    use: {
      ...devices['Desktop Firefox'],
      baseURL: `http://127.0.0.1:${port}`,
    },
  })),
});
