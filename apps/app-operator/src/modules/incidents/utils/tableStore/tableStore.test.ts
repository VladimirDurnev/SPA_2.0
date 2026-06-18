import type { IncidentsTableStoreSlice } from './index';

import { describe, expect, it } from 'vitest';
import { INCIDENTS_ROOT_PARENT_ID } from '../../constants';
import {
  chunkStart,

  isRangeLoaded,
  mergeChildrenRange,
} from './index';

function createEmptyTableStore(): IncidentsTableStoreSlice {
  return {
    nodes: {},
    pagesByParent: {},
    pageMetaByParent: {},
  };
}

describe('tableStore', () => {
  it('chunkStart aligns offset to limit', () => {
    expect(chunkStart(0, 100)).toBe(0);
    expect(chunkStart(99, 100)).toBe(0);
    expect(chunkStart(150, 100)).toBe(100);
  });

  it('mergeChildrenRange stores chunk and marks range loaded', () => {
    const tableStoreSlice = createEmptyTableStore();
    const loadedRootNodes = [{ id: 'r-0', name: 'АЗС 1', hasChildren: true }];

    mergeChildrenRange(
      tableStoreSlice,
      INCIDENTS_ROOT_PARENT_ID,
      0,
      100,
      1000,
      loadedRootNodes,
    );

    expect(tableStoreSlice.pageMetaByParent[INCIDENTS_ROOT_PARENT_ID]?.total).toBe(1000);
    expect(isRangeLoaded(
      INCIDENTS_ROOT_PARENT_ID,
      0,
      100,
      tableStoreSlice.pageMetaByParent[INCIDENTS_ROOT_PARENT_ID]!.loadedRanges,
    )).toBe(true);
    expect(tableStoreSlice.nodes['r-0']?.name).toBe('АЗС 1');
  });
});
