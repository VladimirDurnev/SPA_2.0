# Маршрутизация и lazy-сборка

Документ описывает, как устроены роуты в `apps/app-*` и что происходит при `lazy` на dev и production build.

Связанные файлы:

- `apps/app-*/src/app/router/constants.ts` — `AppRoute` (все path)
- `apps/app-*/src/app/router/index.tsx` — `createBrowserRouter` + lazy routes
- `apps/app-*/src/app/App.tsx` — `RouterProvider` + `Suspense`
- `apps/app-*/src/pages/*` — страницы (тонкие компоненты)

---

## Где живут маршруты

Всё в одном файле — без отдельного `routes.ts`:

```text
apps/app-admin/src/
  app/
    router/
      constants.ts   ← AppRoute (пути)
      index.tsx      ← createBrowserRouter + lazy
    App.tsx
  pages/
    main/MainPage.tsx
    about/AboutPage.tsx
```

### `app/router/constants.ts`

```ts
export enum AppRoute {
  Main = '/',
  About = '/about',
}
```

Пример router (`app-admin`):

```ts
import { AppRoute } from './constants';

{ path: AppRoute.Main, lazy: async () => { ... MainPage } },
{ path: AppRoute.About, lazy: async () => { ... AboutPage } },
```

| App | `AppRoute` | URL | Страница |
|-----|------------|-----|----------|
| `app-admin` / `app-expert` | `Main` | `/` | `pages/main/MainPage.tsx` |
| `app-admin` / `app-expert` | `About` | `/about` | `pages/about/AboutPage.tsx` |
| `app-operator` | `Main` | `/` | `pages/main/MainPage.tsx` |
| `app-operator` | `Incidents` | `/incidents` | `pages/incidents/IncidentsPage.tsx` |
| `app-operator` | `About` | `/about` | `pages/about/AboutPage.tsx` |


У **operator**, **admin**, **expert** одинаковая схема роутинга, но набор маршрутов может отличаться по доменным модулям.

---

## Как работает `lazy` в React Router

1. Пользователь открывает URL (например `/about`).
2. Router находит route с `lazy`.
3. Выполняется `async () => import('...')` — динамический импорт модуля страницы.
4. Из модуля берётся named export (`MainPage`, `AboutPage`) и возвращается `{ Component }`.
5. React Router монтирует компонент.

Пока промис `import()` не завершился, срабатывает `**Suspense`** в `App.tsx`:

```tsx
<Suspense fallback={null}>
  <RouterProvider router={router} />
</Suspense>
```

`fallback={null}` — без спиннера; при необходимости замените на loader/skeleton.

### Почему `import()` внутри route, а не `React.lazy` наверху

React Router 7 ожидает именно contract `lazy: () => Promise<{ Component }>`.  
Vite при этом видит строку пути в `import('@/pages/...')` и **выносит страницу в отдельный chunk** при сборке.

---

## Как Vite собирает lazy (production `build`)

При `npm run -w app-admin build` (Vite + Rollup):

```text
entry: app/index.tsx
  → App.tsx
  → router/index.tsx (в основном бандле)
  → import('@/pages/main/MainPage')   → отдельный файл chunk (например MainPage-xxxxx.js)
  → import('@/pages/about/AboutPage')  → отдельный файл chunk (например AboutPage-xxxxx.js)
```

Что попадает куда:


| Chunk            | Содержимое                                    |
| ---------------- | --------------------------------------------- |
| `index-*.js`     | React, react-router, shell приложения, router |
| `MainPage-*.js`  | только `MainPage` и его прямые зависимости    |
| `AboutPage-*.js` | только `AboutPage` и его прямые зависимости   |


Проверка после сборки:

```bash
npm run -w app-admin build
ls apps/app-admin/dist/assets
```

Ожидаемо: **отдельные** `.js` на каждую страницу с `lazy` + общий `index-*.js`.

### Поведение в браузере

1. Первая загрузка `/` — браузер качает `index-*.js` + `MainPage-*.js`.
2. Переход на `/about` — подгружается **только** `AboutPage-*.js` (если ещё не был в кэше).
3. Повторный визит — chunk из disk cache, без повторной компиляции.

Так уменьшается размер **первого** экрана; тяжёлые страницы не блокируют старт приложения.

### Dev (`npm run dev:admin`)

Vite не собирает один большой bundle: модули отдаются по запросу через ESM.  
`import('@/pages/about/AboutPage')` при переходе на `/about` подгружает модуль отдельным HTTP-запросом — поведение близко к production, но без физических hash-файлов в `dist/`.

---

## Добавить новую страницу (чеклист)

1. Добавить ключ в `app/router/constants.ts`: `Settings: '/settings'`.
2. Создать `src/pages/settings/SettingsPage.tsx`.
3. В `app/router/index.tsx` — route с `path: AppRoute.Settings` и `lazy`.
4. Ссылаться: `<Link to={AppRoute.Settings}>` или `navigate(AppRoute.Settings)`.
5. Собрать: `npm run -w app-admin build` — в `dist/assets` должен появиться новый chunk.

Когда появятся доменные модули — маршруты модуля можно **spread** в тот же массив:

```ts
import { incidentsRoutes } from '@/modules/incidents';

const appRoutes: RouteObject[] = [
  { path: '/', lazy: ... },
  ...incidentsRoutes,
];
```

---

## Навигация между страницами

Используйте API react-router (уже в зависимостях app):

```tsx
import { Link } from 'react-router';

<Link to={AppRoute.About}>О приложении</Link>
```

Программно:

```tsx
import { useNavigate } from 'react-router';
import { AppRoute } from '@/app/router/constants';

const navigate = useNavigate();
navigate(AppRoute.About);
```

---

## Сборка всей монорепы

```bash
npm run build
```

Порядок: сначала `@org/core`, затем все apps.  
Только одно приложение:

```bash
npm run -w app-admin build
```

Целевой браузер: Firefox 115 (`vite.config.ts` → `build.target: ['firefox115']`).

---

## См. также

- `FRONTEND_AR.MD` — общая архитектура монорепы
- `docs/NPM_WORKSPACES.md` — зависимости и workspaces

