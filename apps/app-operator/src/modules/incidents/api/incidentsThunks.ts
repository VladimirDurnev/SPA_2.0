/**
 * Async-thunk'и модуля incidents: все HTTP-запросы и оркестрация lazy-загрузки таблицы.
 *
 * Основной API для таблицы: GET /incidentsTree/nodes (chunk'и по 100).
 * Бублики: GET /incidentsTree/aggregates.
 * Фильтр: GET /incidentsTree?criticality= (nested-режим).
 */
import type {
  IncidentsAggregatesResponse,
  IncidentTreeNode,
  IncidentTreeNodesResponse,
} from '../types';
import type { CriticalityFilterValue } from '../utils/filterIncidentsTree';
import type { RootState } from '@/app/store/types';

import { http } from '@org/core';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ZodError } from 'zod';
import {
  INCIDENTS_PAGE_SIZE,
  INCIDENTS_ROOT_PARENT_ID,
  INCIDENTS_TREE_AGGREGATES_API,
  INCIDENTS_TREE_API,
  INCIDENTS_TREE_NODES_API,
} from '../constants';
import {
  selectIncidentsTableMode,
  selectIsNodeExpanded,
  selectNodeMeta,
  selectParentPageMeta,
} from '../selectors/incidentsSelectors';
import { selectFlatRowAt } from '../selectors/tableSelectors';
import { collectMissingRangeRequests } from '../utils/rangeLoading';
import { isRangeLoaded } from '../utils/tableStore';
import {
  parseIncidentsAggregatesResponse,
  parseIncidentsTreeResponse,
  parseIncidentTreeNodesResponse,
} from './incidentsSchemas';

interface FetchIncidentTreeNodesArgs {
  parentId: string | null;
  offset: number;
  limit: number;
}

interface VisibleFlatRowRange {
  firstVisibleFlatRowIndex: number;
  lastVisibleFlatRowIndex: number;
}

function mapIncidentsApiError(error: unknown, fallbackKey: string) {
  return error instanceof ZodError ? 'errors.invalidResponse' : fallbackKey;
}

/**
 * Загружает диапазон прямых детей одного родителя.
 *
 * @example Корни: `parentId: null, offset: 0, limit: 100` → первые 100 АЗС + total=1000
 * @example Дети: `parentId: 'r-0', offset: 100, limit: 100` → r-0-c100…c199
 *
 * Ответ кладётся в store через `mergeChildrenRange` (см. incidentsSlice).
 */
export const fetchIncidentTreeNodesThunk = createAsyncThunk(
  'incidents/fetchNodes',
  async (
    nodesPageRequest: FetchIncidentTreeNodesArgs,
    { rejectWithValue },
  ) => {
    try {
      const { data } = await http.get<unknown>(INCIDENTS_TREE_NODES_API, {
        params: {
          parentId: nodesPageRequest.parentId === INCIDENTS_ROOT_PARENT_ID
            ? undefined
            : nodesPageRequest.parentId ?? undefined,
          offset: nodesPageRequest.offset,
          limit: nodesPageRequest.limit,
        },
      });

      return parseIncidentTreeNodesResponse(data);
    }
    catch (error) {
      return rejectWithValue(mapIncidentsApiError(error, 'errors.loadFailed'));
    }
  },
);

/**
 * Первая загрузка таблицы при открытии /incidents.
 * Запрашивает первый chunk корней — этого достаточно, чтобы нарисовать скроллбар на полный `total`.
 */
export const initIncidentsTableThunk = createAsyncThunk<
  IncidentTreeNodesResponse,
  void,
  { rejectValue: string }
>(
  'incidents/initTable',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const rootNodesPage = await dispatch(fetchIncidentTreeNodesThunk({
        parentId: null,
        offset: 0,
        limit: INCIDENTS_PAGE_SIZE,
      })).unwrap();

      return rootNodesPage;
    }
    catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'errors.loadFailed');
    }
  },
);

/**
 * Агрегаты для donut-графиков (критичность, состояние, длительность).
 * Не связан с таблицей — отдельный лёгкий endpoint на бэке.
 */
export const fetchIncidentsAggregatesThunk = createAsyncThunk<
  IncidentsAggregatesResponse,
  void,
  { rejectValue: string }
>(
  'incidents/fetchAggregates',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get<unknown>(INCIDENTS_TREE_AGGREGATES_API);
      return parseIncidentsAggregatesResponse(data);
    }
    catch (error) {
      return rejectWithValue(mapIncidentsApiError(error, 'errors.loadFailed'));
    }
  },
);

/**
 * Догружает chunk'и для строк, попавших в видимое окно virtual scroll.
 *
 * Вызывается из IncidentsTable при смене границ видимого окна flat-списка.
 * Для placeholder-строк вычисляет, какой `parentId + offset` ещё не в store, и шлёт fetchIncidentTreeNodesThunk.
 */
export const ensureFlatRangeLoadedThunk = createAsyncThunk<
  void,
  VisibleFlatRowRange,
  { state: RootState }
>(
  'incidents/ensureFlatRangeLoaded',
  async (
    visibleRowRange,
    { dispatch, getState },
  ) => {
    const rootState = getState();

    if (selectIncidentsTableMode(rootState) === 'filtered') {
      return;
    }

    const visibleTableRows = [];
    for (
      let flatRowIndex = visibleRowRange.firstVisibleFlatRowIndex;
      flatRowIndex <= visibleRowRange.lastVisibleFlatRowIndex;
      flatRowIndex += 1
    ) {
      const tableRow = selectFlatRowAt(rootState, flatRowIndex);
      if (tableRow) {
        visibleTableRows.push(tableRow);
      }
    }

    const missingChunkRequests = collectMissingRangeRequests(
      visibleTableRows,
      rootState.incidents.pageMetaByParent,
    );

    await Promise.all(missingChunkRequests.map((chunkRequest) => {
      const parentId = chunkRequest.parentId === INCIDENTS_ROOT_PARENT_ID
        ? null
        : chunkRequest.parentId;

      return dispatch(fetchIncidentTreeNodesThunk({
        parentId,
        offset: chunkRequest.offset,
        limit: chunkRequest.limit,
      }));
    }));
  },
);

/**
 * Раскрыть/свернуть узел в колонке «Название».
 *
 * При раскрытии: если дети ещё не загружены — запрос `parentId=nodeId, offset=0`.
 * В lazy-режиме добавляет nodeId в `expandedIds` → flat-список растёт на `total` детей.
 */
export const toggleExpandNodeThunk = createAsyncThunk<
  { nodeId: string; expanded: boolean },
  string,
  { state: RootState }
>(
  'incidents/toggleExpand',
  async (nodeId, { dispatch, getState }) => {
    const rootState = getState();
    const isNodeExpanded = selectIsNodeExpanded(rootState, nodeId);

    if (selectIncidentsTableMode(rootState) === 'filtered') {
      return { nodeId, expanded: !isNodeExpanded };
    }

    if (isNodeExpanded) {
      return { nodeId, expanded: false };
    }

    const nodeMeta = selectNodeMeta(rootState, nodeId);
    const parentPageMeta = selectParentPageMeta(rootState, nodeId);
    const loadedChildRanges = parentPageMeta?.loadedRanges ?? [];
    const childrenTotal = parentPageMeta?.total;
    const areFirstChildrenLoaded = isRangeLoaded(
      nodeId,
      0,
      INCIDENTS_PAGE_SIZE,
      loadedChildRanges,
    );

    if (nodeMeta?.hasChildren && !areFirstChildrenLoaded) {
      await dispatch(fetchIncidentTreeNodesThunk({
        parentId: nodeId,
        offset: 0,
        limit: INCIDENTS_PAGE_SIZE,
      }));
    }
    else if (nodeMeta?.hasChildren && childrenTotal == null) {
      await dispatch(fetchIncidentTreeNodesThunk({
        parentId: nodeId,
        offset: 0,
        limit: INCIDENTS_PAGE_SIZE,
      }));
    }

    return { nodeId, expanded: true };
  },
);

interface CriticalityFilterResult {
  items: IncidentTreeNode[];
}

/**
 * Фильтр по клику на бублик критичности.
 * Переключает таблицу в режим `filtered`: nested-дерево целиком с бэка (без lazy /nodes).
 */
export const fetchIncidentsByCriticalityThunk = createAsyncThunk<
  CriticalityFilterResult,
  CriticalityFilterValue,
  { rejectValue: string }
>(
  'incidents/fetchByCriticality',
  async (criticalityFilter, { rejectWithValue }) => {
    try {
      const { data: response } = await http.get<unknown>(INCIDENTS_TREE_API, {
        params: { criticality: criticalityFilter },
      });
      const filteredTree = parseIncidentsTreeResponse(response);

      return { items: filteredTree.items };
    }
    catch (error) {
      return rejectWithValue(mapIncidentsApiError(error, 'errors.filterFailed'));
    }
  },
);
