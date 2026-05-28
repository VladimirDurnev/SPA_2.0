# E2E Тесты

E2E-тесты проверяют приложение как пользователь: открыть страницу, дождаться данных, увидеть нужный UI.

В проекте используется Playwright.

Общее разделение unit, integration, E2E и Storybook описано в `docs/TESTING_STRATEGY.md`.

## Скрипты

| Команда | Что делает |
|---------|------------|
| `npm run test:e2e` | Все E2E в Firefox |
| `npm run test:e2e:update` | Осознанно обновить HAR, JSON review-copy и visual snapshots |
| `npm run test:e2e:update:screens` | Обновить только visual snapshots в `screens/*.png` |
| `npm run test:e2e:ui` | Playwright UI (удобно для отладки) |
| `npm run test:e2e:headed` | С видимым браузером |
| `npm run test:e2e:debug` | Пошаговая отладка |
| `npm run test:e2e:report` | Открыть HTML-отчёт после прогона |
| `npm run test:e2e:install` | Установить браузеры (первый раз) |

### Режимы Обновления Эталонов

Для обновления эталонов используем два явных npm-скрипта:

- `npm run test:e2e:update` — полный режим: обновляет HAR, JSON review-copy и `screens/*.png`;
- `npm run test:e2e:update:screens` — только visual snapshots, без перезаписи HAR/JSON.

Полный режим дополнительно выставляет `E2E_UPDATE_MOCKS=true`. По этому флагу тесты разрешают запись HAR, а `playwright.global-teardown.cjs` после прогона пересобирает читаемые `mocks/*.json`.

## Браузеры

Целевой браузер продукта: **Firefox 115 ESR** (Astra Linux), сборка через `vite` → `build.target: ['firefox115']`.

В Playwright:

- `operator` — тесты `app-operator` в Firefox, baseURL `http://127.0.0.1:5173`;
- `admin` — тесты `app-admin` в Firefox, baseURL `http://127.0.0.1:5174`;
- `expert` — тесты `app-expert` в Firefox, baseURL `http://127.0.0.1:5175`.

Playwright ставит свой Firefox for Testing (не обязательно ESR 115). Это автоматическая проверка «как в Firefox». Финальный smoke на Astra — отдельно.

Команда `npm run test:e2e` запускает все эти проекты сразу.

## Первый Запуск

```bash
npm run test:e2e:install
npm run test:e2e
```

## Что Поднимается Автоматически

`playwright.config.ts` сам запускает:

```text
npm run mock:server
npm run -w app-operator dev -- --host 127.0.0.1 --port 5173 --strictPort
npm run -w app-admin dev -- --host 127.0.0.1 --port 5174 --strictPort
npm run -w app-expert dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Руками перед тестом обычно не нужно отдельно запускать mock и dev-сервер.

Если серверы уже запущены, Playwright переиспользует их.

В конфиге используется `127.0.0.1`, а не `localhost`, чтобы на Windows не уходить в IPv6 `[::1]`.

## Windows: test:e2e:ui

Если при `npm run test:e2e:ui` видишь:

```text
ERR_NETWORK_ACCESS_DENIED at http://[::1]:...
```

Скрипт уже запускает UI с `--ui-host=127.0.0.1`. Если ошибка остаётся:

1. Разреши Node.js в брандмауэре Windows.
2. Попробуй `npm run test:e2e:headed` или `npm run test:e2e:debug` вместо UI.
3. Обычный прогон `npm run test:e2e` должен работать без UI.

## Где Лежат Тесты

```text
apps/app-operator/src/modules/incidents/__e2e__/
```

Внутри `__e2e__` делаем отдельную папку под каждый сценарий:

```text
apps/app-operator/src/modules/<module>/__e2e__/
  <scenario-name>/
    <scenario-name>.spec.ts
    mocks/
      <scenario-name>.har
      <scenario-name>.json
    screens/
      <snapshot-name>-<project>.png
```

Название папки сценария, spec-файла, моков и snapshot-а должно совпадать по смыслу. Так сразу видно, какой тест использует какие моки и какие эталонные скрины.

## Что Проверять

Хороший первый E2E для страницы:

- страница открылась;
- API замокан через HAR;
- заголовок виден;
- ключевой UI-компонент виден: таблица, график, форма.
- важное состояние UI проверено snapshot-ом, если есть риск визуальной поломки.

Не нужно в E2E проверять всю бизнес-логику. Для этого лучше unit-тесты.

## Моки

Для стабильных E2E и visual snapshots не полагаемся на случайное состояние `mock/db.json`.

Тест использует HAR как источник моков. Это удобно, когда у сценария много API-запросов: один `routeFromHAR` покрывает все записанные endpoint-ы, и в spec-файле не нужно писать отдельный `page.route()` на каждый запрос.

```ts
test.beforeEach(async ({ page }) => {
  // HAR — источник моков для теста. Обычный прогон читает ответы из HAR,
  // а `test:e2e:update` перезаписывает HAR.
  await page.routeFromHAR(
    'apps/app-operator/src/modules/incidents/__e2e__/collapse-first-row/mocks/collapse-first-row.har',
    {
      notFound: 'fallback',
      update: process.env.E2E_UPDATE_MOCKS === 'true',
      updateContent: 'embed',
      updateMode: 'minimal',
      url: '**/api/incidentsTree**',
    },
  );

  // JSON рядом с HAR нужен только для review. Его автоматически обновляет
  // `playwright.global-teardown.cjs` после записи HAR через `test:e2e:update`.
});
```

Так snapshot падает только из-за изменения UI, а не потому что поменялись данные.

HAR обновляется вместе со snapshot-ами в полном режиме:

```bash
npm run test:e2e:update -- --grep "supports collapsing"
```

`test:e2e:update` — это не обычная проверка, а режим перезаписи эталонов. После такого прогона Playwright обновит HAR и screenshots, а `playwright.global-teardown.cjs` автоматически:

- отформатирует HAR;
- вытащит `application/json` записи из HAR;
- перезапишет рядом читаемый `<scenario-name>.json` со структурой `entries[]`;
- для каждой записи сохранит `request` и `response`, чтобы было видно URL, метод, заголовки, статус и тело ответа.

После записи нужно проверить diff:

- `.har` — основной мок, его использует обычный прогон и CI;
- `.json` — читаемая копия request/response из HAR для review;
- `screens/*.png` — visual baseline, его коммитим только если изменение UI ожидаемое.

Короткое правило: **HAR — источник для теста, JSON — только readable review copy.**

Не правим `.json` как источник истины: при следующей записи он снова будет перегенерирован из HAR. Если нужно изменить мок руками, правим источник данных/mock API и запускаем обновление через `npm run test:e2e:update`.

Если изменился только внешний вид и данные моков трогать не нужно, запускаем:

```bash
npm run test:e2e:update:screens
```

## Пример

```ts
import { expect, test } from '@playwright/test';

test('incidents page shows charts and table', async ({ page }) => {
  await page.goto('/incidents');

  await expect(page.getByRole('heading', { name: 'Текущие инциденты' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Критичность инцидента' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Список инцидентов' })).toBeVisible();
  await expect(page.getByText('АЗС')).toBeVisible();

  await page.getByRole('button', { name: 'Свернуть строку' }).first().click();
  await expect(page).toHaveScreenshot('collapse-first-row.png', {
    animations: 'disabled',
    fullPage: true,
  });
});
```

## Visual Snapshots

Обычные проверки могут пройти, даже если UI визуально сломан. Для таких случаев используем `toHaveScreenshot`.

В тесте incidents фиксируется состояние после действия:

```text
открыть /incidents → свернуть первый expander таблицы → сравнить скриншот страницы
```

Первый раз или после осознанного изменения UI нужно обновить эталон:

```bash
npm run test:e2e:update:screens
```

Если вместе с UI поменялись API-ответы сценария, используем полный режим `npm run test:e2e:update`.

После этого обычный прогон:

```bash
npm run test:e2e
```

Если UI изменится, но JS-ошибки не будет, Playwright сравнит текущий скрин с эталоном и уронит тест по diff.

## Артефакты При Ошибке

При падении теста Playwright сохраняет артефакты в:

```text
test-results/
```

Сейчас включены:

- `screenshot: 'only-on-failure'` — скриншот только при ошибке;
- `trace: 'on-first-retry'` — trace при повторе теста.

Если прогон зелёный, скриншоты не создаются.

Visual baseline-скриншоты хранятся в папке сценария `screens/` и должны попадать в репозиторий.

## Правило

E2E должен быть коротким и проверять пользовательский сценарий.

Если тест начинает проверять детали Redux, selectors или utils — это уже не E2E.
