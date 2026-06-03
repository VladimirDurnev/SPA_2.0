# Zod — Runtime-Валидация Данных

`Zod` проверяет данные **во время выполнения**, а не только на этапе TypeScript.

TypeScript исчезает после сборки. Если API вернёт другую структуру, `interface` это не поймает. `Zod` проверяет реальный JSON до того, как он попадёт в Redux или UI.

## Когда Использовать

Хорошие случаи:

- ответы API (`GET`, `POST`);
- тело запроса перед отправкой;
- `localStorage` / query-параметры;
- формы с пользовательским вводом;
- mock-файлы и HAR, если хотите явный контракт.

Плохие случаи (обычно не нужен Zod):

- чистые функции внутри приложения, где типы уже гарантированы;
- props между своими React-компонентами;
- константы и enum в коде;
- дублирование каждого `interface` «на всякий случай».

## Где Лежит В Проекте

```text
apps/app-*/src/modules/<module>/api/
  <module>Schemas.ts   — схемы и parse-функции
  <module>Thunks.ts    — вызов parse после http.get
```

Пример в шаблоне:

```text
apps/app-operator/src/modules/incidents/api/
  incidentsSchemas.ts
  incidentsThunks.ts
```

`zod` объявлен в `apps/*/package.json`, версия фиксируется в корневом `overrides`:

```json
"zod": "^4.4.3"
```

Схемы доменного API живут рядом с модулем, а не в `@org/core`, пока они не стали общими для всех приложений.

## Базовый Паттерн

### 1. Схема

```ts
import { z } from 'zod';

export const IncidentCriticalitySchema = z.enum(['high', 'medium', 'low']);

export const IncidentsTreeResponseSchema = z.object({
  items: z.array(IncidentTreeNodeSchema),
  defaultExpandedRowKeys: z.array(z.string()),
});
```

### 2. Parse-функция — единая точка доверия

```ts
export function parseIncidentsTreeResponse(data: unknown): IncidentsTreeResponse {
  return IncidentsTreeResponseSchema.parse(data);
}
```

До `parse` — `unknown`. После успешного `parse` — нормальный тип `IncidentsTreeResponse`.

### 3. Thunk

```ts
const { data } = await http.get<unknown>(INCIDENTS_TREE_API);
return parseIncidentsTreeResponse(data);
```

Не делайте:

```ts
const { data } = await http.get<IncidentsTreeResponse>(url);
```

Так TypeScript «верит» ответу, но runtime-проверки нет.

### 4. Ошибка в Redux / UI

```ts
import { ZodError } from 'zod';

function mapIncidentsApiError(error: unknown, fallbackKey: string) {
  return error instanceof ZodError ? 'errors.invalidResponse' : fallbackKey;
}
```

В `IncidentsTable` ошибка показывается через Ant Design `notification` (через `AntdApp.useApp()`).

## `parse` И `safeParse`

| Метод | Поведение |
|-------|-----------|
| `.parse(data)` | Успех → данные. Ошибка → бросает `ZodError`. |
| `.safeParse(data)` | Всегда возвращает `{ success, data?, error? }`, без throw. |

В thunks удобен `parse` внутри `try/catch`:

```ts
try {
  return parseIncidentsTreeResponse(data);
}
catch (error) {
  return rejectWithValue(mapIncidentsApiError(error, 'errors.loadFailed'));
}
```

`safeParse` — когда нужна своя ветка без исключений (формы, мягкая валидация).

## `optional`, `nullable`, `enum`

```ts
criticality: IncidentCriticalitySchema.nullable().optional(),
```

| Комбинация | Что допускает JSON |
|------------|-------------------|
| `.optional()` | поля нет |
| `.nullable()` | `"criticality": null` |
| оба | нет поля, `null`, или значение enum |

```ts
z.enum(['high', 'medium', 'low'])
```

Любая другая строка — ошибка валидации.

## Рекурсивные Структуры (Дерево)

Для `children` внутри того же типа узла:

```ts
export const IncidentTreeNodeSchema: z.ZodType<IncidentTreeNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    children: z.array(IncidentTreeNodeSchema).optional(),
  }),
);
```

`z.lazy` нужен, когда схема ссылается на саму себя.

## Чеклист Для Нового API

1. Описать схему в `api/<module>Schemas.ts`.
2. Добавить `parseXxxResponse(data: unknown)`.
3. В thunk: `http.get<unknown>` → `parseXxxResponse(data)`.
4. В `catch` отделить `ZodError` от сетевой ошибки.
5. Добавить ключи в `locales` (`errors.invalidResponse` и т.д.).
6. Показать пользователю через `notification` или empty/error state — **в одном месте**, не в каждом компоненте.

## Zod И Тесты

- **Unit** — можно тестировать `parse` на валидном/битом JSON без UI.
- **Integration** — обычно с mock Redux state, без реального API.
- **E2E** — сценарий пользователя; coverage от E2E в Vitest не считается.

Для ФСТЭК/приёмки основной **coverage** — unit + integration (Vitest). E2E — отдельное доказательство сценариев.

## См. Также

- `apps/app-operator/src/modules/incidents/api/incidentsSchemas.ts` — эталон схемы;
- `apps/app-operator/src/modules/incidents/api/incidentsThunks.ts` — эталон thunk;
- `docs/DEPENDENCIES.md` — правила зависимостей и `overrides`;
- `docs/TESTING_STRATEGY.md` — unit / integration / E2E.
