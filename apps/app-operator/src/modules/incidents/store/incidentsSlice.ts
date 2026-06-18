/**
 * Redux-state lazy tree-table.
 *
 * Дерево в памяти не хранится целиком — только загруженные chunk'и (`pagesByParent`)
 * и мета (`pageMetaByParent.total` для честного скроллбара).
 */
import type {
  IncidentsAggregatesResponse,
  IncidentsTableMode,
  IncidentTreeNode,
  IncidentTreeNodeSummary,
} from '../types';

import type { CriticalityFilterValue } from '../utils/filterIncidentsTree';

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchIncidentsAggregatesThunk,
  fetchIncidentsByCriticalityThunk,
  fetchIncidentTreeNodesThunk,
  initIncidentsTableThunk,
  toggleExpandNodeThunk,
} from '../api/incidentsThunks';
import { INCIDENTS_ROOT_PARENT_ID } from '../constants';
import { collectExpandedIds, collectNodeMeta } from '../utils/normalizeTreeStore';
import { mergeChildrenRange, resetLazyTableState } from '../utils/tableStore';

export interface IncidentsState {
  /** Все когда-либо загруженные узлы по id */
  nodes: Record<string, IncidentTreeNodeSummary>;
  /** Дети родителя: parentId → { offset chunk → items[] } */
  pagesByParent: Record<string, Record<number, IncidentTreeNodeSummary[]>>;
  /** total детей у родителя + какие offset/limit уже загружены */
  pageMetaByParent: Record<string, { total: number; loadedRanges: Array<{ offset: number; limit: number }> }>;
  /** hasChildren / loading для expand-кнопки */
  nodeMeta: Record<string, { hasChildren: boolean; childTotal?: number; loaded?: boolean; loading?: boolean }>;
  /** Раскрытые узлы → их дети участвуют в flat-списке */
  expandedIds: string[];
  /** Nested-дерево при фильтре по бубликам (режим filtered) */
  filteredItems: IncidentTreeNode[];
  /** lazy — chunk'и /nodes; filtered — nested с бэка */
  tableMode: IncidentsTableMode;
  aggregates: IncidentsAggregatesResponse | null;
  criticalityFilter: CriticalityFilterValue | null;
  isLoading: boolean;
  /** true после первого успешного initIncidentsTableThunk */
  isTableInitialized: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  nodes: {},
  pagesByParent: {},
  pageMetaByParent: {},
  nodeMeta: {},
  expandedIds: [],
  filteredItems: [],
  tableMode: 'lazy',
  aggregates: null,
  criticalityFilter: null,
  isLoading: false,
  isTableInitialized: false,
  error: null,
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    /** Сброс фильтра бублика → возврат к lazy-режиму (нужен повторный init) */
    clearCriticalityFilter(state) {
      resetLazyTableState(state);
      state.filteredItems = [];
      state.expandedIds = [];
      state.nodeMeta = {};
      state.tableMode = 'lazy';
      state.criticalityFilter = null;
      state.isTableInitialized = false;
    },
    setNodeLoading(state, action: { payload: { nodeId: string; loading: boolean } }) {
      const nodeMetaEntry = state.nodeMeta[action.payload.nodeId] ?? { hasChildren: true };
      state.nodeMeta[action.payload.nodeId] = { ...nodeMetaEntry, loading: action.payload.loading };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initIncidentsTableThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initIncidentsTableThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTableInitialized = true;
        state.tableMode = 'lazy';
        mergeChildrenRange(
          state,
          INCIDENTS_ROOT_PARENT_ID,
          action.payload.offset,
          action.payload.limit,
          action.payload.total,
          action.payload.items,
        );

        for (const loadedNode of action.payload.items) {
          state.nodeMeta[loadedNode.id] = {
            hasChildren: loadedNode.hasChildren,
            childTotal: loadedNode.hasChildren ? undefined : undefined,
          };
        }
      })
      .addCase(initIncidentsTableThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'errors.loadFallback';
      })
      .addCase(fetchIncidentTreeNodesThunk.fulfilled, (state, action) => {
        const { parentId, offset, limit, total, items } = action.payload;
        const normalizedParentId = parentId || INCIDENTS_ROOT_PARENT_ID;

        mergeChildrenRange(state, normalizedParentId, offset, limit, total, items);

        if (normalizedParentId !== INCIDENTS_ROOT_PARENT_ID) {
          const parentMeta = state.nodeMeta[normalizedParentId] ?? { hasChildren: true };
          state.nodeMeta[normalizedParentId] = {
            ...parentMeta,
            hasChildren: total > 0,
            childTotal: total,
            loaded: true,
            loading: false,
          };
        }

        for (const loadedNode of items) {
          state.nodeMeta[loadedNode.id] = {
            hasChildren: loadedNode.hasChildren,
            childTotal: loadedNode.hasChildren ? state.pageMetaByParent[loadedNode.id]?.total : undefined,
          };
        }
      })
      .addCase(toggleExpandNodeThunk.pending, (state, action) => {
        const nodeId = action.meta.arg;
        const nodeMetaEntry = state.nodeMeta[nodeId];
        if (nodeMetaEntry) {
          state.nodeMeta[nodeId] = { ...nodeMetaEntry, loading: true };
        }
      })
      .addCase(toggleExpandNodeThunk.fulfilled, (state, action) => {
        const { nodeId, expanded } = action.payload;

        if (expanded) {
          if (!state.expandedIds.includes(nodeId)) {
            state.expandedIds.push(nodeId);
          }
        }
        else {
          state.expandedIds = state.expandedIds.filter(
            expandedNodeId => expandedNodeId !== nodeId,
          );
        }

        const nodeMetaEntry = state.nodeMeta[nodeId];
        if (nodeMetaEntry) {
          state.nodeMeta[nodeId] = { ...nodeMetaEntry, loading: false };
        }
      })
      .addCase(fetchIncidentsAggregatesThunk.fulfilled, (state, action) => {
        state.aggregates = action.payload;
      })
      .addCase(fetchIncidentsByCriticalityThunk.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.criticalityFilter = action.meta.arg;
      })
      .addCase(fetchIncidentsByCriticalityThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableMode = 'filtered';
        state.filteredItems = action.payload.items;
        state.expandedIds = collectExpandedIds(action.payload.items);
        state.nodeMeta = collectNodeMeta(action.payload.items);
      })
      .addCase(fetchIncidentsByCriticalityThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'errors.filterFallback';
      });
  },
});

export const { clearCriticalityFilter, setNodeLoading } = incidentsSlice.actions;
export const incidentsReducer = incidentsSlice.reducer;
