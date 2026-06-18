import { describe, expect, it } from 'vitest';

import { INCIDENTS_ROOT_PARENT_ID } from '../../constants';
import {
  getFlatRowCountLazy,
  resolveFlatRowAtLazy,
} from './index';

describe('flattenVisibleRows', () => {
  const lazyFlatListFixture = {
    nodes: {
      'r-0': { id: 'r-0', name: 'АЗС 1', hasChildren: true },
      'r-0-c0': { id: 'r-0-c0', name: 'Блок 1.1', hasChildren: false },
    },
    pagesByParent: {
      [INCIDENTS_ROOT_PARENT_ID]: {
        0: [{ id: 'r-0', name: 'АЗС 1', hasChildren: true }],
      },
      'r-0': {
        0: [{ id: 'r-0-c0', name: 'Блок 1.1', hasChildren: false }],
      },
    },
    pageMetaByParent: {
      [INCIDENTS_ROOT_PARENT_ID]: { total: 3, loadedRanges: [{ offset: 0, limit: 100 }] },
      'r-0': { total: 1, loadedRanges: [{ offset: 0, limit: 100 }] },
    },
    expandedIds: [] as string[],
    nodeMeta: {
      'r-0': { hasChildren: true },
      'r-0-c0': { hasChildren: false },
    },
  };

  it('counts only root rows when collapsed', () => {
    expect(getFlatRowCountLazy(lazyFlatListFixture)).toBe(3);
  });

  it('includes children when expanded', () => {
    expect(getFlatRowCountLazy({ ...lazyFlatListFixture, expandedIds: ['r-0'] })).toBe(4);
  });

  it('resolves root row at index', () => {
    const rootRow = resolveFlatRowAtLazy(0, lazyFlatListFixture);
    expect(rootRow).toMatchObject({ id: 'r-0', depth: 0 });
  });

  it('resolves child row after expand', () => {
    const childRow = resolveFlatRowAtLazy(1, { ...lazyFlatListFixture, expandedIds: ['r-0'] });
    expect(childRow).toMatchObject({ id: 'r-0-c0', depth: 1 });
  });
});
