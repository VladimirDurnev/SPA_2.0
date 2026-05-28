# @org/core

Платформенный пакет монорепы SPA2.

## Для разработчика app

**Не импортируйте** `antd`, `axios`, `lodash` и т.д. напрямую в `apps/*/src`.

Используйте:

```ts
import { ConfigProvider, http, Table } from '@org/core';
```

Полное правило: [docs/DEPENDENCIES.md](../docs/DEPENDENCIES.md).

## Добавить библиотеку в платформу

```bash
# из корня репозитория
npm run add:core -- <package>
```

Затем реэкспорт в `core/index.ts` (или `core/components/…`) и при необходимости запись в `overrides` корневого `package.json`.
