// @vitest-environment jsdom

import type { IncidentsState } from '../../store/incidentsSlice';

import { AppI18nProvider, AppThemeProvider } from '@org/core';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { incidentsI18nResources } from '../../locales';
import { incidentsReducer } from '../../store/incidentsSlice';
import { IncidentsTable } from './IncidentsTable';

import '@testing-library/jest-dom/vitest';

// Моковое состояние имитирует уже загруженные инциденты в Redux.
// API здесь не вызываем: проверяем связку store -> компонент -> действие пользователя.
const incidentsState: IncidentsState = {
  allItems: [
    {
      id: 'block-1',
      name: 'Блок 1',
      children: [
        {
          id: 'tg-1',
          name: 'ТГ-1',
          criticality: 'high',
          incidentState: 'model',
          totalIncidents: 3,
        },
      ],
    },
  ],
  items: [
    {
      id: 'block-1',
      name: 'Блок 1',
      children: [
        {
          id: 'tg-1',
          name: 'ТГ-1',
          criticality: 'high',
          incidentState: 'model',
          totalIncidents: 3,
        },
      ],
    },
  ],
  criticalityFilter: null,
  expandedRowKeys: ['block-1'],
  isLoading: false,
  error: null,
};

function createIncidentsTestStore() {
  // Создаём настоящий Redux store, но с тестовым preloadedState.
  // Поэтому reducer и dispatch работают как в приложении, без моков функций.
  return configureStore({
    reducer: {
      incidents: incidentsReducer,
    },
    preloadedState: {
      incidents: incidentsState,
    },
  });
}

function renderIncidentsTable() {
  const store = createIncidentsTestStore();

  // Рендерим компонент в той же обвязке, которая нужна ему в приложении:
  // Redux Provider, i18n и theme/Ant Design providers.
  const view = render(
    <Provider store={store}>
      <AppI18nProvider modules={[incidentsI18nResources]}>
        <AppThemeProvider>
          <IncidentsTable />
        </AppThemeProvider>
      </AppI18nProvider>
    </Provider>,
  );

  return { store, ...view };
}

beforeAll(() => {
  // Ant Design использует browser API, которых нет в jsdom.
  // Добавляем минимальные заглушки, чтобы тест мог рендерить таблицу.
  const getComputedStyle = window.getComputedStyle;

  class ResizeObserverMock implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.getComputedStyle = (element: Element) => getComputedStyle(element);
  window.ResizeObserver = ResizeObserverMock;
  window.matchMedia = window.matchMedia ?? (() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
});

afterEach(() => {
  cleanup();
});

describe('incidents table integration', () => {
  it('renders incidents from Redux store and updates expanded rows on collapse', async () => {
    const user = userEvent.setup();
    const { container, store } = renderIncidentsTable();

    // Данные берутся из Redux store и отображаются в таблице.
    expect(await screen.findByText('Список инцидентов')).toBeInTheDocument();
    expect(screen.getByText('Блок 1')).toBeInTheDocument();
    expect(screen.getByText('ТГ-1')).toBeInTheDocument();

    // Кликаем по реальной кнопке раскрытия строки Ant Design Table.
    const expandButton = container.querySelector<HTMLButtonElement>('.ant-table-row-expand-icon');

    expect(expandButton).not.toBeNull();
    await user.click(expandButton!);

    // Проверяем результат интеграции: UI-событие вызвало dispatch,
    // reducer обновил Redux state, а дочерняя строка пропала из DOM.
    await waitFor(() => {
      expect(store.getState().incidents.expandedRowKeys).toEqual([]);
    });
    expect(screen.queryByText('ТГ-1')).not.toBeInTheDocument();
  });
});
