/**
 * Определяет, какие GET /nodes запросить для placeholder-строк в видимом окне.
 */
import type { IncidentTableRow } from '../../types';

import type { LoadedRange } from '../tableStore';
import { INCIDENTS_PAGE_SIZE, INCIDENTS_ROOT_PARENT_ID } from '../../constants';
import { isPlaceholderRow } from '../../types';
import { chunkStart, isRangeLoaded } from '../tableStore';

export interface NodesChunkRequest {
  parentId: string;
  offset: number;
  limit: number;
}

export function offsetsForSiblingRange(
  rangeStartOffset: number,
  rangeEndOffset: number,
  chunkSize: number = INCIDENTS_PAGE_SIZE,
): number[] {
  if (rangeEndOffset < rangeStartOffset) {
    return [];
  }

  const firstChunkOffset = chunkStart(rangeStartOffset, chunkSize);
  const lastChunkOffset = chunkStart(rangeEndOffset, chunkSize);
  const chunkOffsets: number[] = [];

  for (let chunkOffset = firstChunkOffset; chunkOffset <= lastChunkOffset; chunkOffset += chunkSize) {
    chunkOffsets.push(chunkOffset);
  }

  return chunkOffsets;
}

/**
 * По строкам видимого окна собирает уникальные `{ parentId, offset, limit }`,
 * для которых chunk ещё не в `pageMetaByParent.loadedRanges`.
 */
export function collectMissingRangeRequests(
  visibleTableRows: IncidentTableRow[],
  pageMetaByParent: Record<string, { loadedRanges: LoadedRange[] }>,
  chunkSize: number = INCIDENTS_PAGE_SIZE,
): NodesChunkRequest[] {
  const missingChunkRequests = new Map<string, NodesChunkRequest>();

  for (const tableRow of visibleTableRows) {
    if (!isPlaceholderRow(tableRow)) {
      continue;
    }

    const parentId = tableRow.parentId || INCIDENTS_ROOT_PARENT_ID;
    const chunkOffset = chunkStart(tableRow.siblingOffset, chunkSize);
    const requestKey = `${parentId}:${chunkOffset}`;

    const loadedRanges = pageMetaByParent[parentId]?.loadedRanges ?? [];
    if (isRangeLoaded(parentId, chunkOffset, chunkSize, loadedRanges)) {
      continue;
    }

    missingChunkRequests.set(requestKey, {
      parentId,
      offset: chunkOffset,
      limit: chunkSize,
    });
  }

  return [...missingChunkRequests.values()];
}
