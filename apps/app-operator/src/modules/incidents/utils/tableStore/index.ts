/**
 * Низкоуровневые операции над chunk-хранилищем в Redux (pagesByParent / pageMetaByParent).
 */
import type { IncidentTreeNodeSummary } from '../../types';

import { INCIDENTS_ROOT_PARENT_ID } from '../../constants';

export interface LoadedRange {
  offset: number;
  limit: number;
}

export interface ParentPageMeta {
  total: number;
  loadedRanges: LoadedRange[];
}

export interface IncidentsTableStoreSlice {
  nodes: Record<string, IncidentTreeNodeSummary>;
  pagesByParent: Record<string, Record<number, IncidentTreeNodeSummary[]>>;
  pageMetaByParent: Record<string, ParentPageMeta>;
}

/** Начало chunk'а: offset 150 при limit 100 → 100 */
export function chunkStart(offset: number, limit: number): number {
  return Math.floor(offset / limit) * limit;
}

export function isRangeLoaded(
  parentId: string,
  offset: number,
  limit: number,
  loadedRanges: LoadedRange[],
): boolean {
  const requestedChunkStart = chunkStart(offset, limit);
  const requestedChunkEnd = requestedChunkStart + limit;

  return loadedRanges.some((loadedRange) => {
    const loadedChunkStart = chunkStart(loadedRange.offset, loadedRange.limit);
    const loadedChunkEnd = loadedChunkStart + loadedRange.limit;
    return loadedChunkStart <= requestedChunkStart && loadedChunkEnd >= requestedChunkEnd;
  });
}

/** Записать ответ /nodes в store (идемпотентно для того же offset) */
export function mergeChildrenRange(
  tableStoreSlice: IncidentsTableStoreSlice,
  parentId: string,
  offset: number,
  limit: number,
  totalChildren: number,
  loadedNodes: IncidentTreeNodeSummary[],
): void {
  const normalizedParentId = parentId || INCIDENTS_ROOT_PARENT_ID;
  const chunkOffset = chunkStart(offset, limit);

  if (!tableStoreSlice.pagesByParent[normalizedParentId]) {
    tableStoreSlice.pagesByParent[normalizedParentId] = {};
  }

  tableStoreSlice.pagesByParent[normalizedParentId][chunkOffset] = loadedNodes;

  const parentPageMeta = tableStoreSlice.pageMetaByParent[normalizedParentId] ?? {
    total: totalChildren,
    loadedRanges: [],
  };

  parentPageMeta.total = totalChildren;

  if (!isRangeLoaded(normalizedParentId, offset, limit, parentPageMeta.loadedRanges)) {
    parentPageMeta.loadedRanges.push({ offset: chunkOffset, limit });
  }

  tableStoreSlice.pageMetaByParent[normalizedParentId] = parentPageMeta;

  for (const loadedNode of loadedNodes) {
    tableStoreSlice.nodes[loadedNode.id] = loadedNode;
  }
}

export function getNodeAtSiblingOffset(
  tableStoreSlice: IncidentsTableStoreSlice,
  parentId: string,
  siblingIndex: number,
  chunkSize: number,
): IncidentTreeNodeSummary | null {
  const normalizedParentId = parentId || INCIDENTS_ROOT_PARENT_ID;
  const chunkOffset = chunkStart(siblingIndex, chunkSize);
  const indexInsideChunk = siblingIndex - chunkOffset;
  const loadedChunk = tableStoreSlice.pagesByParent[normalizedParentId]?.[chunkOffset];

  return loadedChunk?.[indexInsideChunk] ?? null;
}

export function resetLazyTableState(tableStoreSlice: IncidentsTableStoreSlice): void {
  tableStoreSlice.nodes = {};
  tableStoreSlice.pagesByParent = {};
  tableStoreSlice.pageMetaByParent = {};
}
