// @vitest-environment jsdom

import type { IncidentsState } from '../../store/incidentsSlice';

import { AppI18nProvider, AppThemeProvider } from '@org/core';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { INCIDENTS_ROOT_PARENT_ID } from '../../constants';
import { incidentsI18nResources } from '../../locales';
import { incidentsReducer } from '../../store/incidentsSlice';
import { IncidentsTable } from './IncidentsTable';

import '@testing-library/jest-dom/vitest';

const incidentsState: IncidentsState = {
  nodes: {
    'r-0': { id: 'r-0', name: 'АЗС 1', hasChildren: true, cmState: 'active' },
    'r-0-c0': { id: 'r-0-c0', name: 'Блок 1.1', hasChildren: false, criticality: 'high' },
  },
  pagesByParent: {
    [INCIDENTS_ROOT_PARENT_ID]: {
      0: [{ id: 'r-0', name: 'АЗС 1', hasChildren: true, cmState: 'active' }],
    },
    'r-0': {
      0: [{ id: 'r-0-c0', name: 'Блок 1.1', hasChildren: false, criticality: 'high' }],
    },
  },
  pageMetaByParent: {
    [INCIDENTS_ROOT_PARENT_ID]: { total: 2, loadedRanges: [{ offset: 0, limit: 100 }] },
    'r-0': { total: 1, loadedRanges: [{ offset: 0, limit: 100 }] },
  },
  nodeMeta: {
    'r-0': { hasChildren: true },
    'r-0-c0': { hasChildren: false },
  },
  expandedIds: ['r-0'],
  filteredItems: [],
  tableMode: 'lazy',
  aggregates: null,
  criticalityFilter: null,
  isLoading: false,
  isTableInitialized: true,
  error: null,
};

function createIncidentsTestStore() {
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
  it('renders lazy rows and collapses expanded node', async () => {
    const user = userEvent.setup();
    renderIncidentsTable();

    expect(await screen.findByText('Список инцидентов')).toBeInTheDocument();
    expect(screen.getByText('АЗС 1')).toBeInTheDocument();
    expect(screen.getByText('Блок 1.1')).toBeInTheDocument();

    const expandButton = screen.getByRole('button', { name: 'Collapse' });
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.queryByText('Блок 1.1')).not.toBeInTheDocument();
    });
  });
});
