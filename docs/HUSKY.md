# Husky — Pre-Push

Используем **только `pre-push`**. `pre-commit` нет — коммитить можно без ожидания линтера.

Проверки запускаются **перед `git push`**, команды прописаны прямо в `.husky/pre-push`, без отдельных `check:*` скриптов в `package.json`.

## Что Запускается

```text
npm run lint
npm run lint:styles
npm run lint:apps-imports
npm run test:run
```

| Шаг | Зачем |
|-----|-------|
| `lint` | ESLint по всему репозиторию |
| `lint:styles` | Stylelint (в т.ч. styled-components) |
| `lint:apps-imports` | Запрет прямых `antd` / `axios` / `styled` в `apps` |
| `test:run` | Vitest: unit + integration |

Обычно ~1–2 минуты (зависит от машины). Это нормально для push — он реже, чем commit.

## Файл Hook

```text
.husky/pre-push          ← ваши команды (только этот файл правим)
.husky/_/pre-push        ← служебный, генерирует Husky, не трогать
```

Содержимое `.husky/pre-push`:

```sh
npm run lint
npm run lint:styles
npm run lint:apps-imports
npm run test:run
```

Git вызывает `.husky/_/pre-push`, тот запускает `.husky/pre-push`.

## Как Проверить, Что Husky Работает

### 1. Git должен знать про hooks

```bash
git config core.hooksPath
```

Ожидается:

```text
.husky/_
```

Если пусто:

```bash
npm run prepare
```

### 2. Файл hook существует

```text
.husky/pre-push
```

### 3. Ручной прогон (Windows, Git Bash)

В PowerShell `sh` часто нет — hook всё равно идёт через Git Bash при `git push`.

Проверка вручную:

```bash
"C:\Program Files\Git\bin\bash.exe" -c "cd /e/spa2.0 && .husky/pre-push"
```

Должны побежать `lint`, `lint:styles`, `test:run` с выводом в терминал.

### 4. Реальный push

```bash
git push
```

Должен быть тот же вывод. **`git push --dry-run` hook не запускает.**

### 5. Почему могло «ничего не быть»

| Причина | Что сделать |
|---------|-------------|
| Не делали `npm install` / `npm run prepare` | `npm run prepare` |
| `git push --no-verify` | push без флага |
| `HUSKY=0` в окружении | убрать переменную |
| Push из GUI без hooks | push из терминала |
| Вывод в другой вкладке IDE | смотреть терминал Git |
| Hook упал мгновенно до npm | проверить шаг 3 |
| Ещё не было `.husky/pre-push` при том push | push ещё раз после `prepare` |

### 6. Отключить временно

```bash
git push --no-verify
```

или

```bash
set HUSKY=0
git push
```

## Что Не Гоняем На Push

- `build` всех приложений;
- `test:e2e` (Playwright + dev-серверы);
- `test:coverage:check`;
- Storybook build.

Это для CI или ручного прогона перед релизом.

## Обход

```bash
git push --no-verify
```

Только для срочных случаев. В основную ветку merge — через зелёный CI.

## Установка

После `npm install` в корне monorepo:

```bash
npm run prepare
```

## Ручной Прогон (Как На Push)

```bash
npm run lint
npm run lint:styles
npm run lint:apps-imports
npm run test:run
```

## CI (Когда Появится)

Pipeline должен повторять этот набор и добавлять тяжёлое:

```text
lint → lint:styles → lint:apps-imports → test:run
→ typecheck → coverage → build → e2e smoke → SBOM/SCA
```

Husky — локальный фильтр, CI — источник истины для приёмки.

## См. Также

- `.husky/pre-push`;
- `package.json` — скрипты `lint`, `lint:styles`, `lint:apps-imports`, `test:run`;
- `docs/TESTING_STRATEGY.md`.

## Отписка (шаблон SPA 2)

### 04.06.2026

В рамках шаблона для SPA 2:

- Подключил Husky: проверки только на `pre-push` (без `pre-commit`)
- Составил документацию по hook: lint, stylelint, `lint:apps-imports`, `test:run` перед push (`docs/HUSKY.md`)
- Составил черновой OpenAPI-контракт `docs/api/openapi.draft.yaml` (инциденты, карточка, аналитика, аномалии, оборудование, отчёты)

### 03.06.2026

В рамках шаблона для SPA 2:

- Подключил Zod и сделали эталон валидации ответа API
- Добавил обработку ошибок контракта API: notification Ant Design
- Составил документацию по runtime-валидации
