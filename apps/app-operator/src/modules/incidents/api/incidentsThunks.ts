import type { IncidentsTreeResponse, IncidentTreeNode } from '../types';
import type { CriticalityFilterValue } from '../utils/filterIncidentsTree';
import type { RootState } from '@/app/store/types';

import { http } from '@org/core';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ZodError } from 'zod';
import { INCIDENTS_TREE_API } from '../constants';
import { filterTreeByCriticality } from '../utils/filterIncidentsTree';
import { parseIncidentsTreeResponse } from './incidentsSchemas';

function mapIncidentsApiError(error: unknown, fallbackKey: string) {
  return error instanceof ZodError ? 'errors.invalidResponse' : fallbackKey;
}

export const fetchIncidentsTreeThunk = createAsyncThunk<
  IncidentsTreeResponse,
  void,
  { rejectValue: string }
>(
  'incidents/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get<unknown>(INCIDENTS_TREE_API);
      return parseIncidentsTreeResponse(data);
    }
    catch (error) {
      return rejectWithValue(mapIncidentsApiError(error, 'errors.loadFailed'));
    }
  },
);

interface CriticalityFilterResult {
  items: IncidentTreeNode[];
  allItems?: IncidentTreeNode[];
}

/** GET /incidentsTree?criticality=… — mock/server.cjs отдаёт отфильтрованное дерево */
export const fetchIncidentsByCriticalityThunk = createAsyncThunk<
  CriticalityFilterResult,
  CriticalityFilterValue,
  { rejectValue: string; state: RootState }
>(
  'incidents/fetchByCriticality',
  async (criticality, { getState, rejectWithValue }) => {
    try {
      const cachedAllItems = getState().incidents.allItems;
      let allItems = cachedAllItems;

      if (!allItems.length) {
        const { data: fullResponse } = await http.get<unknown>(INCIDENTS_TREE_API);
        const full = parseIncidentsTreeResponse(fullResponse);
        allItems = full.items;
      }

      const { data: response } = await http.get<unknown>(INCIDENTS_TREE_API, {
        params: { criticality },
      });
      const data = parseIncidentsTreeResponse(response);

      const items = data.items.length > 0
        ? data.items
        : filterTreeByCriticality(allItems, criticality);

      return {
        items,
        allItems: cachedAllItems.length ? undefined : allItems,
      };
    }
    catch (error) {
      return rejectWithValue(mapIncidentsApiError(error, 'errors.filterFailed'));
    }
  },
);
