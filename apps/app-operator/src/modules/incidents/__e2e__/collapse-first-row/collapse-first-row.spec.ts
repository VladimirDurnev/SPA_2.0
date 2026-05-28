import { expect, test } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };

const shouldUpdateMocks = process.env.E2E_UPDATE_MOCKS === 'true';

test.beforeEach(async ({ page }) => {
  // HAR — источник моков для теста. Один HAR может покрывать много API-запросов,
  // поэтому не нужно писать отдельный `page.route()` на каждый endpoint.
  // Обычный прогон читает ответы из HAR, а `test:e2e:update` перезаписывает HAR.
  await page.routeFromHAR(
    'apps/app-operator/src/modules/incidents/__e2e__/collapse-first-row/mocks/collapse-first-row.har',
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

test('incidents table supports collapsing the first row', async ({ page }) => {
  await page.goto('/incidents');

  await page.getByRole('button', { name: 'Свернуть строку' }).first().click();
  await expect(page.getByRole('row', { name: /Блок 1/ })).toBeHidden();
  await expect(page).toHaveScreenshot('collapse-first-row.png', {
    animations: 'disabled',
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Высокая' }).click();
  await page.getByRole('button', { name: 'Развернуть строку' }).click();
  await expect(page).toHaveScreenshot('high-filter.png', {
    animations: 'disabled',
    fullPage: true,
  });
});
