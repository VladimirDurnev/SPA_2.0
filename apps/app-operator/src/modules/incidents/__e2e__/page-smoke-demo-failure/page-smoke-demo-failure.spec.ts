import { expect, test } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };

const shouldUpdateMocks = process.env.E2E_UPDATE_MOCKS === 'true';

test.beforeEach(async ({ page }) => {
  // HAR — источник моков для теста. Один HAR может покрывать много API-запросов,
  // поэтому не нужно писать отдельный `page.route()` на каждый endpoint.
  // Обычный прогон читает ответы из HAR, а `test:e2e:update` перезаписывает HAR.
  await page.routeFromHAR(
    'apps/app-operator/src/modules/incidents/__e2e__/page-smoke-demo-failure/mocks/page-smoke-demo-failure.har',
    {
      notFound: 'fallback',
      update: shouldUpdateMocks,
      updateContent: 'embed',
      updateMode: 'minimal',
      url: '**/api/incidentsTree**',
    },
  );

  // JSON рядом с HAR нужен только для review. Его автоматически обновляет
  // `playwright.global-teardown.cjs` после записи HAR через `test:e2e:update`.
});

test('incidents page shows charts and table', async ({ page }) => {
  await page.goto('/incidents');

  await expect(page.getByRole('heading', { name: 'Текущие инциденты' })).toBeVisible();
  await expect(page.getByText('Критичность инцидента')).toBeVisible();
  await expect(page.getByText('Список инцидентов')).toBeVisible();

  await expect(page.getByRole('columnheader', { name: 'Название ЦМ' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Критичность инцидента' })).toBeVisible();
  await expect(page.getByText('АЗС')).toBeVisible();
});
