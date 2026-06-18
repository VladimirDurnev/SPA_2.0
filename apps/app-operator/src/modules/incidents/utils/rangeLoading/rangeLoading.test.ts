import { describe, expect, it } from 'vitest';

import { INCIDENTS_ROOT_PARENT_ID } from '../../constants';
import { isPlaceholderRow } from '../../types';
import { collectMissingRangeRequests, offsetsForSiblingRange } from './index';

describe('rangeLoading', () => {
  it('offsetsForSiblingRange returns aligned chunks', () => {
    expect(offsetsForSiblingRange(0, 50, 100)).toEqual([0]);
    expect(offsetsForSiblingRange(150, 250, 100)).toEqual([100, 200]);
  });

  it('collectMissingRangeRequests deduplicates parent chunks', () => {
    const placeholderRows = [
      {
        id: 'placeholder:r-150',
        isPlaceholder: true as const,
        depth: 0,
        parentId: INCIDENTS_ROOT_PARENT_ID,
        siblingOffset: 150,
      },
      {
        id: 'placeholder:r-199',
        isPlaceholder: true as const,
        depth: 0,
        parentId: INCIDENTS_ROOT_PARENT_ID,
        siblingOffset: 199,
      },
    ];

    const missingChunkRequests = collectMissingRangeRequests(placeholderRows, {});

    expect(missingChunkRequests).toEqual([{
      parentId: INCIDENTS_ROOT_PARENT_ID,
      offset: 100,
      limit: 100,
    }]);
    expect(isPlaceholderRow(placeholderRows[0])).toBe(true);
  });
});
