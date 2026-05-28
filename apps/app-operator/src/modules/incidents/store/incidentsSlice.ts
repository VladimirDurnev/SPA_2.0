import type { IncidentTreeNode } from '../types';

import type { CriticalityFilterValue } from '../utils/filterIncidentsTree';

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchIncidentsByCriticalityThunk,
  fetchIncidentsTreeThunk,
} from '../api/incidentsThunks';

export interface IncidentsState {
  /** Полное дерево с бэка (без фильтра) */
  allItems: IncidentTreeNode[];
  /** Дерево для таблицы (отфильтрованное или полное) */
  items: IncidentTreeNode[];
  criticalityFilter: CriticalityFilterValue | null;
  expandedRowKeys: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  allItems: [],
  items: [],
  criticalityFilter: null,
  expandedRowKeys: [],
  isLoading: false,
  error: null,
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setExpandedRowKeys(state, action: { payload: string[] }) {
      state.expandedRowKeys = action.payload;
    },
    clearCriticalityFilter(state) {
      state.items = state.allItems;
      state.criticalityFilter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentsTreeThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidentsTreeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allItems = action.payload.items;
        state.items = action.payload.items;
        state.criticalityFilter = null;
        if (state.expandedRowKeys.length === 0) {
          state.expandedRowKeys = action.payload.defaultExpandedRowKeys;
        }
      })
      .addCase(fetchIncidentsTreeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'errors.loadFallback';
      })
      .addCase(fetchIncidentsByCriticalityThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.criticalityFilter = action.meta.arg;
      })
      .addCase(fetchIncidentsByCriticalityThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.allItems) {
          state.allItems = action.payload.allItems;
        }
        state.items = action.payload.items;
        state.criticalityFilter = action.meta.arg;
      })
      .addCase(fetchIncidentsByCriticalityThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'errors.filterFallback';
      });
  },
});

export const { setExpandedRowKeys, clearCriticalityFilter } = incidentsSlice.actions;
export const incidentsReducer = incidentsSlice.reducer;
