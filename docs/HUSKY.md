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
.husky/pre-push
```

```sh
#!/usr/bin/env sh
set -e
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run lint:styles
npm run lint:apps-imports
npm run test:run
```

`set -e` — остановка на первой ошибке.

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
