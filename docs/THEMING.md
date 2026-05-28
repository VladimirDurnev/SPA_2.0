# Темизация

Темизация в проекте построена на `styled-components`.

Главная идея простая: **core хранит тему и провайдер, компоненты берут цвета и отступы из `theme`**.

## Самая Важная Схема

```text
apps/app-operator/src/app/providers.tsx
  -> AppThemeProvider
      -> styled-components ThemeProvider
      -> Ant Design ConfigProvider
      -> GlobalStyles
          -> все компоненты получают theme
```

`AppThemeProvider` подключается один раз на всё приложение.

Модулям не нужен свой `ThemeProvider`. Они просто используют `styled` и `theme`.

## Где Провайдер

Провайдер подключается здесь:

```text
apps/app-operator/src/app/providers.tsx
```

Пример:

```tsx
<AppI18nProvider modules={appI18nModules}>
  <AppThemeProvider>{children}</AppThemeProvider>
</AppI18nProvider>
```

Сам провайдер лежит в core:

```text
core/theme/AppThemeProvider.tsx
```

Он делает четыре вещи:

- выбирает текущую тему: `dark` или `light`;
- сохраняет выбранную тему в `localStorage`;
- передаёт тему в `styled-components`;
- передаёт тему и локаль в Ant Design.

## Где Лежат Темы

Темы описаны здесь:

```text
core/theme/themes.ts
```

Там есть два объекта:

```text
appThemes.dark
appThemes.light
```

Внутри темы лежат общие токены:

```text
colors.background
colors.surface
colors.text
colors.border
colors.status
colors.chart
radius
spacing
```

Токены — это не CSS-классы. Это значения, которые потом используются в styled-components.

Например:

```tsx
background: ${({ theme }) => theme.colors.surface.base};
padding: ${({ theme }) => theme.spacing.md};
border-radius: ${({ theme }) => theme.radius.md};
```

## Где Типы Темы

Тип темы лежит здесь:

```text
core/theme/types.ts
```

Подключение типа к `styled-components` лежит здесь:

```text
core/theme/styledComponents.ts
```

Благодаря этому TypeScript понимает:

```tsx
theme.colors.text.primary
theme.spacing.md
theme.radius.pill
```

Если написать несуществующий токен, TypeScript подсветит ошибку.

## Как Писать Стили

`styled` нужно импортировать из `@org/core`:

```tsx
import { styled } from '@org/core';
```

Не нужно импортировать напрямую из `styled-components`:

```tsx
import styled from 'styled-components';
```

Правильный пример:

```tsx
import { styled } from '@org/core';

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface.base};
  border: 1px solid ${({ theme }) => theme.colors.border.base};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.md};
`;
```

## Как Менять Тему

Для переключения темы есть готовый компонент:

```tsx
import { ThemeToggle } from '@org/core';
```

Он использует хук:

```tsx
import { useThemeMode } from '@org/core';

const { mode, toggleMode, setMode } = useThemeMode();
```

`mode` может быть:

```text
dark
light
```

Обычно руками хук не нужен. На странице достаточно поставить `ThemeToggle`.

## Где Глобальные Стили

Глобальные стили лежат здесь:

```text
core/theme/GlobalStyles.tsx
```

Они задают базовые стили для всего приложения:

```tsx
body {
  background: ${({ theme }) => theme.colors.background.body};
  color: ${({ theme }) => theme.colors.text.primary};
}
```

`GlobalStyles` подключается внутри `AppThemeProvider`, поэтому отдельно его подключать не надо.

## Как Стилизовать Ant Design

Ant Design получает тему внутри:

```text
core/theme/AppThemeProvider.tsx
```

Там используется:

```text
ConfigProvider
```

Токены Ant Design создаются здесь:

```text
core/theme/antdTheme.ts
```

Если нужно глобально поменять цвета Ant Design, лучше менять `antdTheme.ts`.

Если нужно поменять конкретную таблицу или кнопку в модуле, можно стилизовать локально через `styled`.

Пример из таблицы incidents:

```tsx
export const DataTable = styled(Table)`
  .ant-table {
    background: ${({ theme }) => theme.colors.surface.elevated};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  .ant-table-thead > tr > th {
    background: ${({ theme }) => theme.colors.surface.muted} !important;
    border-color: ${({ theme }) => theme.colors.border.base} !important;
    color: ${({ theme }) => theme.colors.text.muted} !important;
  }
`;
```

## Где Хранить Стили Модуля

Для модуля стили лучше держать рядом с компонентом.

Пример:

```text
modules/incidents/components/table/
  IncidentsTable.tsx
  IncidentsTable.styles.ts
```

В компоненте:

```tsx
import { Root, Title } from './IncidentsTable.styles';
```

В стилях:

```tsx
import { styled } from '@org/core';

export const Root = styled.section`
  background: ${({ theme }) => theme.colors.surface.base};
  padding: ${({ theme }) => theme.spacing.md};
`;
```

## Core Цвета И Доменные Цвета

Core-тема хранит общие цвета:

```text
background
surface
text
border
status
chart
```

Доменные цвета можно хранить рядом с модулем, если они относятся только к бизнес-сущности.

Например, цвета критичности инцидентов:

```text
critical
high
medium
low
```

Такие цвета не обязательно добавлять в core-тему, если они нужны только модулю `incidents`.

Правило:

- общий UI-цвет — в `core/theme/themes.ts`;
- бизнес-цвет конкретного модуля — рядом с модулем;
- отступы, радиусы, фон, текст, border — брать из `theme`.

## Как Добавить Новый Токен

Если нужен новый общий токен:

1. Добавить тип в:

```text
core/theme/types.ts
```

2. Добавить значение для dark и light в:

```text
core/theme/themes.ts
```

3. Использовать в styled-components:

```tsx
color: ${({ theme }) => theme.colors.text.primary};
```

Важно: токен нужно добавить и в `dark`, и в `light`.

## Коротко

```text
core/theme/AppThemeProvider.tsx
  провайдер темы

core/theme/themes.ts
  значения dark и light темы

core/theme/types.ts
  типы theme tokens

core/theme/styledComponents.ts
  подключение типов к styled-components

core/theme/GlobalStyles.tsx
  глобальные стили body/a

core/theme/antdTheme.ts
  тема для Ant Design

components/*.styles.ts
  локальные стили компонентов
```

Запомнить можно так:

```text
AppThemeProvider даёт theme
styled читает theme
tokens лежат в core/theme/themes.ts
модули используют tokens, но не создают свой ThemeProvider
```
