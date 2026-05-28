import type { IncidentsTreeResponse, IncidentTreeNode } from '../types';
import type { CriticalityFilterValue } from '../utils/filterIncidentsTree';
import type { RootState } from '@/app/store/types';

import { http } from '@org/core';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { INCIDENTS_TREE_API } from '../constants';
import { filterTreeByCriticality } from '../utils/filterIncidentsTree';

export const fetchIncidentsTreeThunk = createAsyncThunk<
  IncidentsTreeResponse,
  void,
  { rejectValue: string }
>(
  'incidents/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get<IncidentsTreeResponse>(INCIDENTS_TREE_API);
      return data;
    }
    catch {
      return rejectWithValue('errors.loadFailed');
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
        const { data: full } = await http.get<IncidentsTreeResponse>(INCIDENTS_TREE_API);
        allItems = full.items;
      }

      const { data } = await http.get<IncidentsTreeResponse>(INCIDENTS_TREE_API, {
        params: { criticality },
      });

      const items = data.items.length > 0
        ? data.items
        : filterTreeByCriticality(allItems, criticality);

      return {
        items,
        allItems: cachedAllItems.length ? undefined : allItems,
      };
    }
    catch {
      return rejectWithValue('errors.filterFailed');
    }
  },
);
