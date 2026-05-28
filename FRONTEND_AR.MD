# Архитектура Фронтенда SPA 2

Документ фиксирует текущее состояние шаблона SPA 2 и правила, по которым его можно развивать в рабочих командах.

## Коротко

Проект — монорепозиторий на `npm workspaces`:

```text
apps/
  app-operator/
  app-admin/
  app-expert/
core/
docs/
```

Технологии:

- React 19 + TypeScript + Vite;
- React Router 7;
- Redux Toolkit;
- `@org/core` как общий платформенный пакет;
- styled-components + Ant Design;
- i18next;
- Vitest для unit/integration;
- Playwright для E2E;
- Storybook как каталог UI-компонентов.

## Границы Ответственности

`apps/app-*` — самостоятельные приложения. Здесь находятся страницы, роутинг, store и доменные модули конкретного приложения.

`core` — общая платформа: UI-обёртки, тема, i18n, HTTP-клиент, переиспользуемые компоненты и утилиты. `core` не должен импортировать код из `apps`.

`core/storybook` — один Storybook для общей UI-документации и примеров компонентов приложений.

`docs` — правила и инструкции для команды.

## Структура Приложения

Базовая структура приложения:

```text
apps/app-operator/src/
  app/
    App.tsx
    providers.tsx
    router/
    store/
  pages/
    main/
    about/
    incidents/
  modules/
    incidents/
    users/
```

`app` — composition root: провайдеры, роутер, store.

`pages` — тонкие страницы, которые собирают модульные компоненты.

`modules` — доменная логика: компоненты, store, thunks, hooks, selectors, utils, локали, тесты.

## Публичный API Модулей

У модуля может быть `index.ts` как публичная точка входа. Наружу экспортируем только то, что реально нужно странице или другому слою.

Не импортируем внутренности чужого модуля напрямую без необходимости.

## Зависимости

В коде `apps/*/src`:

- React/Redux/Router импортируются напрямую;
- UI, HTTP, тема, i18n и платформенные утилиты импортируются из `@org/core`;
- `antd`, `axios`, `lodash`, `styled-components` напрямую в приложениях не импортируем.

Подробно: `docs/DEPENDENCIES.md`.

## Роутинг

Роуты живут в `apps/app-*/src/app/router`.

Страницы подключаются через `lazy`, чтобы Vite выносил их в отдельные чанки.

Подробно: `docs/ROUTING.md`.

## Тема И I18n

Тема подключается через `AppThemeProvider` из `@org/core`.

Переводы подключаются через `AppI18nProvider`; общие словари лежат в `core`, словари модулей — рядом с модулем.

Подробно:

- `docs/THEMING.md`;
- `docs/I18N.md`.

## Тестирование

В шаблоне заложены три уровня:

- unit/integration через Vitest;
- E2E через Playwright;
- визуальная документация через Storybook.

Coverage считается по `apps/*/src` через Vitest. E2E в процент покрытия кода не входит, но остаётся отдельным доказательством сценарного тестирования.

Команды:

```bash
npm run test:run
npm run test:coverage
npm run test:coverage:html
npm run test:coverage:check
npm run test:e2e
npm run test:storybook
```

Подробно:

- `docs/TESTING_STRATEGY.md`;
- `docs/E2E.md`;
- `docs/STORYBOOK.md`.

## E2E

E2E лежат рядом с доменным модулем в `__e2e__`.

Для сценария используется отдельная папка:

```text
modules/<module>/__e2e__/
  <scenario-name>/
    <scenario-name>.spec.ts
    mocks/
    screens/
```

HAR — источник моков для Playwright. JSON рядом с HAR нужен только для review.

## Storybook

Storybook один на монорепозиторий:

```text
core/storybook/
```

Stories делятся на зоны:

- `ui` — общие UI-компоненты из `@org/core`;
- `app-operator` — примеры конкретного приложения/модуля.

## Готовность Шаблона

Архитектура готова для демонстрации коллегам как рабочая база:

- монорепозиторий и workspaces настроены;
- общий `@org/core` выделен;
- приложения имеют одинаковую базовую структуру;
- Storybook подключён;
- Vitest coverage настроен;
- Playwright E2E и visual snapshots подключены;
- документация разложена по темам.

Что важно проговорить на демонстрации:

- текущее покрытие тестами ниже 80%, это контрольная цель, а не уже достигнутый статус;
- E2E пока представлены на примере `app-operator`;
- при добавлении E2E в `app-admin` и `app-expert` нужно добавлять сценарии в их модули, инфраструктура уже готова;
- `core` не должен превращаться в склад доменной логики.

## См. Также

- `docs/NPM_WORKSPACES.md`;
- `docs/DEPENDENCIES.md`;
- `docs/TESTING_STRATEGY.md`;
- `docs/E2E.md`;
- `docs/STORYBOOK.md`;
- `docs/THEMING.md`;
- `docs/I18N.md`;
- `docs/ROUTING.md`.
