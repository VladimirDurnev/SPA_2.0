# npm workspaces (монорепа) — как это работает и как ставить пакеты

Этот репозиторий — **монорепа на npm workspaces**:

- `apps/*` — отдельные приложения (Vite)
- `core/` — общий пакет `@org/core`
- корень — **workspace-root**: общие скрипты, dev-инструменты, фиксация версий (`overrides`)

> **Простое правило для всей команды:** [DEPENDENCIES.md](./DEPENDENCIES.md) — что тянуть из `@org/core`, что из `react`, зачем два `package.json`.

---

## Ментальная модель (коротко)

### Что значит `"@org/core": "0.0.0"` в `apps/*/package.json`

`@org/core` — **локальный workspace-пакет** (папка `core/`), у которого:

- `name: "@org/core"`
- `version: "0.0.0"`

Когда приложение пишет:

```json
"dependencies": {
  "@org/core": "0.0.0"
}
```

npm при установке **не скачивает** `@org/core` из registry, а **линкует локальную папку** `core/`, потому что она входит в `workspaces` и версия совпадает.

---

## Правило зависимостей (идеальный вариант)

- **App (`apps/app-*`)** — в `package.json` и в коде только:
  - `react`, `react-dom`, `react-router`, `react-redux`, `@reduxjs/toolkit`
  - `@org/core` (antd, axios, lodash, d3… **только через него**)
- **`core`** — все остальные runtime-библиотеки + их реэкспорт в `core/index.ts`
- **Корень** — `overrides` (версии) + dev-инструменты; **не импортируем из корня в код**

Подробно: [DEPENDENCIES.md](./DEPENDENCIES.md).

---

## Единые версии во всей монорепе: `overrides`

В `package.json` в корне есть:

```json
"overrides": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "antd": "^5.0.0",
  "...": "..."
}
```

Это означает: **какой бы workspace-пакет ни запросил зависимость**, npm при установке будет стараться ставить **именно эти версии**.

Зачем:
- единый стек версий (нет “разъезда” между apps)
- проще обновлять/чинить security (одна точка управления)

---

## Как быстро ставить зависимости

### Установка всего

Из корня:

```bash
npm install
```

Это поставит зависимости **для всех workspaces сразу**.

### Установить пакет в конкретный workspace

#### В `core`

```bash
npm i -w @org/core <package>
```

Пример:

```bash
npm i -w @org/core i18next react-i18next
```

#### В приложение

```bash
npm i -w app-operator <package>
```

Пример:

```bash
npm i -w app-operator @tanstack/react-query
```

### Удалить пакет из workspace

```bash
npm rm -w app-expert <package>
```

---

## Полезные команды этого репо

- Dev:
  - `npm run dev:operator`
  - `npm run dev:admin`
  - `npm run dev:expert`
- Build всех:
  - `npm run build`
- Линт:
  - `npm run lint`
  - `npm run lint:styles`
- Unit/integration:
  - `npm run test:run`
  - `npm run test:coverage`
  - `npm run test:coverage:html`
  - `npm run test:coverage:check`
- E2E:
  - `npm run test:e2e`
  - `npm run test:e2e:update`
  - `npm run test:e2e:update:screens`
- Storybook (ядро):
  - `npm run storybook`
  - `npm run test:storybook`

---

## Частые вопросы

### Можно ли “оставить зависимости только в корне” и чтобы apps их брали оттуда?

Технически иногда “будет работать” из‑за hoisting, но это **хрупко**:
- теряются явные границы (непонятно, что реально нужно пакету)
- разные менеджеры/настройки могут сломать резолв

В этом репо придерживаемся правила:
**“импортируешь — объявляешь зависимость”**, а версии фиксируем в корне через `overrides`.

