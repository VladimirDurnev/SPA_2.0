# Зависимости

Документ фиксирует правило зависимостей для монорепозитория SPA 2.

## Главное Правило

```text
apps/*/src  ->  React/Redux/Router напрямую
apps/*/src  ->  UI, HTTP, тема, i18n через @org/core
core        ->  общие runtime-библиотеки платформы
root        ->  dev tools, scripts, overrides
```

В приложениях не импортируем напрямую:

- `antd`;
- `axios`;
- `lodash`;
- `styled-components`.

Для этого есть `@org/core`.

## Где Какие Зависимости

Корневой `package.json`:

- `workspaces`;
- общие scripts;
- dev-инструменты (`eslint`, `vite`, `typescript`, `vitest`, `playwright`);
- `overrides` для единых версий.

`core/package.json`:

- общие runtime-библиотеки платформы;
- `antd`, `axios`, `d3`, `dayjs`, `lodash`, `styled-components`, i18n-пакеты;
- React-стек, который нужен core-компонентам.

`apps/app-*/package.json`:

- `@org/core`;
- `react`, `react-dom`;
- `react-router`;
- `react-redux`;
- `@reduxjs/toolkit`.

## Как Импортировать

```ts
import { Table, http, styled, useTranslation } from '@org/core';
```

```ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Link } from 'react-router';
```

Не делаем так в `apps/*/src`:

```ts
import { Table } from 'antd';
import axios from 'axios';
import styled from 'styled-components';
```

## Что Сейчас Экспортирует `@org/core`

Актуальный список смотри в `core/index.ts`.

Основные группы:

- Ant Design wrappers: `Table`, `ConfigProvider` и другие экспорты из `core/components/antd`;
- donut chart компоненты и типы;
- `LocaleToggle`;
- `ThemeToggle`;
- `styled`;
- i18n helpers;
- `http`, `mapHttpError`;
- `arc`, `pie`, `select` из D3;
- theme providers/tokens.

## Добавить Новую Библиотеку

Если библиотека нужна как часть платформы или общего UI:

```bash
npm run add:core -- <package>
```

Затем:

1. Добавить экспорт в `core/index.ts` или вложенный публичный файл core.
2. При необходимости добавить версию в `overrides` корневого `package.json`.
3. Использовать в приложениях через `@org/core`.

Если библиотека нужна только одному приложению и не является платформенной, ставим её в конкретный workspace:

```bash
npm i -w app-operator <package>
```

Но прямые импорты `antd`, `axios`, `lodash`, `styled-components` в apps всё равно запрещены.

## Контроль

Проверить запрет прямых импортов:

```bash
npm run lint:apps-imports
```

Полный линт:

```bash
npm run lint
```

## Почему Так

Такой подход даёт:

- единый UI/API слой для всех приложений;
- один способ обновлять версии;
- меньше дублирования между `operator`, `admin`, `expert`;
- понятную границу: домен живёт в app, платформа живёт в core.

## См. Также

- `docs/NPM_WORKSPACES.md`;
- `docs/HUSKY.md`;
- `docs/ZOD.md`;
- `FRONTEND_AR.MD`;
- `core/README.md`.
