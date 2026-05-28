# Storybook

Storybook — это каталог UI-компонентов. Он помогает быстро открыть компонент отдельно от страницы, API, Redux и роутинга.

## Быстрый Старт

Запустить:

```bash
npm run storybook
```

Проверить сборку:

```bash
npm run test:storybook
```

Добавить новую story:

1. Скопировать шаблон:

```text
core/storybook/stories/_templates/Component.stories.tsx.example
```

2. Положить файл в нужную зону:

```text
core/storybook/stories/ui/
core/storybook/stories/app-operator/
```

3. Поменять `title`, `component`, `args`.

Если компонент простой, оставляем один вариант:

```tsx
export const Default: Story = {};
```

## Как Это Устроено

```text
core/storybook/
├── .storybook/
│   ├── main.ts          # конфиг Storybook + Vite aliases
│   └── preview.tsx      # глобальные decorators
├── src/
│   └── StorybookProviders.tsx
└── stories/
    ├── ui/              # базовые UI stories из @org/core
    ├── app-operator/    # stories конкретного приложения
    └── _templates/      # шаблоны
```

Storybook ищет файлы:

```text
core/storybook/stories/**/*.stories.tsx
```

Глобальная обвязка уже подключена в:

```text
core/storybook/src/StorybookProviders.tsx
```

В обычной story не нужно руками добавлять:

- `AppThemeProvider`;
- `AppI18nProvider`;
- Ant Design `ConfigProvider`;
- `antd/dist/reset.css`;
- локали `common` и `incidents`.

## Готовые Примеры

Базовая таблица Ant Design через `@org/core`:

```text
core/storybook/stories/ui/AntdTable.stories.tsx
```

Donut chart:

```text
core/storybook/stories/ui/DonutChart.stories.tsx
```

Доменная таблица incidents:

```text
core/storybook/stories/app-operator/incidents/IncidentsTable.stories.tsx
```

В боковой панели Storybook это выглядит так:

```text
UI / Ant Design / Table
UI / Charts / DonutChart
App Operator / Incidents / Table
```

## Зоны Stories

`UI` — общие UI-компоненты и обёртки из `@org/core`.

```text
core/storybook/stories/ui/
```

`App Operator` — примеры конкретного приложения или feature-модуля.

```text
core/storybook/stories/app-operator/
```

Так сразу видно, что является общим UI, а что относится к приложению.

## Минимальный Пример

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DonutChart } from '@org/core';

const meta = {
  title: 'UI/Charts/DonutChart',
  component: DonutChart,
  args: {
    title: 'Критичность инцидента',
    chartData: [],
    legendData: [],
  },
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

`args` — это обычные props компонента по умолчанию.

## Когда Делать Несколько Stories

Не надо плодить варианты, если они выглядят одинаково.

Вторую/третью story добавляем только когда состояние реально другое:

- `Loading`;
- `Empty`;
- `Error`;
- `Disabled`;
- `Selected`;
- `WithLongText`;
- `WithoutData`.

## Моки

Моки кладём рядом со story, если они нужны только ей:

```text
core/storybook/stories/app-operator/incidents/incidentsTree.mock.ts
```

Импорт:

```tsx
import { incidentsTreeMock } from './incidentsTree.mock';
```

Если мок станет общим для многих stories, можно вынести его отдельно позже. Заранее усложнять не нужно.

## На Какие Компоненты Делать Stories

Stories нужны для компонентов, которые можно смотреть отдельно:

- UI из `@org/core`: графики, кнопки, переключатели, карточки, бейджи;
- обёртки над Ant Design: таблицы, формы, модалки;
- визуальные компоненты модулей: таблица incidents, строка графиков, cell renderers;
- компоненты с важными состояниями: `loading`, `empty`, `error`, `disabled`, `selected`;
- компоненты, которые нужно показать дизайнеру, аналитику, QA или команде.

Stories обычно не нужны для:

- Redux slices;
- thunks;
- selectors;
- чистых utils;
- технических providers;
- страниц целиком, если они тянут router/store/API.

Если хочется показать страницу, лучше вынести из неё чистый UI-компонент и сделать story на него.

## Проверка

```bash
npm run test:storybook
```

Сейчас это smoke-проверка через сборку Storybook.

Она ловит:

- сломанные импорты;
- ошибки в `.storybook/main.ts`;
- ошибки в providers;
- невалидные TSX/stories;
- проблемы с alias `@org/core` и `@`.

## Важно

Если меняли файлы:

```text
core/storybook/.storybook/main.ts
core/storybook/.storybook/preview.tsx
core/storybook/src/StorybookProviders.tsx
```

Storybook лучше перезапустить.

## Главное Правило

Хорошая story отвечает на вопрос:

```text
Как выглядит компонент при конкретных props?
```

Плохая story пытается повторить всё приложение.

Если в story приходится тащить Redux, router, API или большой setup — компонент стоит упростить или вынести чистую UI-часть.
