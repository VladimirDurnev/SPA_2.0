/**
 * Плоский список строк дерева без материализации всего массива.
 *
 * Lazy-режим: обход по `pageMetaByParent.total` + `expandedIds`.
 * Если chunk не загружен — возвращается placeholder (см. rangeLoading).
 */
import type {
  IncidentPlaceholderRow,
  IncidentTableRow,
  IncidentTreeNode,
  IncidentVisibleRow,
} from '../../types';

import type { IncidentsTableStoreSlice } from '../tableStore';
import { INCIDENTS_PAGE_SIZE, INCIDENTS_ROOT_PARENT_ID } from '../../constants';
import { buildSiblingId } from '../buildNodeId';
import { getNodeAtSiblingOffset } from '../tableStore';

/** Данные store, нужные для построения lazy flat-списка */
export interface LazyFlatListContext extends IncidentsTableStoreSlice {
  expandedIds: string[];
  nodeMeta: Record<string, { hasChildren: boolean; childTotal?: number }>;
}

/** Данные nested-дерева в режиме фильтра по бубликам */
export interface FilteredFlatListContext {
  items: IncidentTreeNode[];
  expandedIds: string[];
}

function getDirectChildrenCount(lazyFlatList: LazyFlatListContext, parentId: string): number {
  return lazyFlatList.pageMetaByParent[parentId]?.total ?? 0;
}

function getNodeMeta(
  lazyFlatList: LazyFlatListContext,
  nodeId: string,
): { hasChildren: boolean; childTotal?: number } {
  const loadedNode = lazyFlatList.nodes[nodeId];
  if (loadedNode) {
    return {
      hasChildren: loadedNode.hasChildren,
      childTotal: lazyFlatList.pageMetaByParent[nodeId]?.total,
    };
  }

  return lazyFlatList.nodeMeta[nodeId] ?? { hasChildren: false };
}

function toVisibleRow(
  node: { id: string; name: string; hasChildren: boolean } & Partial<IncidentVisibleRow>,
  depth: number,
): IncidentVisibleRow {
  return { ...node, depth } as IncidentVisibleRow;
}

function toPlaceholderRow(
  parentId: string,
  siblingIndex: number,
  depth: number,
): IncidentPlaceholderRow {
  return {
    id: `placeholder:${buildSiblingId(parentId, siblingIndex)}`,
    isPlaceholder: true,
    depth,
    parentId,
    siblingOffset: siblingIndex,
  };
}

function resolveSiblingRow(
  lazyFlatList: LazyFlatListContext,
  parentId: string,
  siblingIndex: number,
  depth: number,
): IncidentTableRow {
  const nodeId = buildSiblingId(parentId, siblingIndex);
  const loadedNode = getNodeAtSiblingOffset(lazyFlatList, parentId, siblingIndex, INCIDENTS_PAGE_SIZE)
    ?? lazyFlatList.nodes[nodeId];

  if (loadedNode) {
    return toVisibleRow(loadedNode, depth);
  }

  return toPlaceholderRow(parentId, siblingIndex, depth);
}

function countVisibleFlatRowsUnderParent(lazyFlatList: LazyFlatListContext, parentId: string): number {
  const directChildrenCount = getDirectChildrenCount(lazyFlatList, parentId);
  let flatRowCount = directChildrenCount;

  for (let siblingIndex = 0; siblingIndex < directChildrenCount; siblingIndex += 1) {
    const nodeId = buildSiblingId(parentId, siblingIndex);
    const nodeMeta = getNodeMeta(lazyFlatList, nodeId);

    if (lazyFlatList.expandedIds.includes(nodeId) && nodeMeta.hasChildren) {
      flatRowCount += countVisibleFlatRowsUnderParent(lazyFlatList, nodeId);
    }
  }

  return flatRowCount;
}

function findLazyFlatRowByIndex(
  lazyFlatList: LazyFlatListContext,
  remainingFlatRowIndex: number,
  parentId: string = INCIDENTS_ROOT_PARENT_ID,
  depth = 0,
): IncidentTableRow | null {
  const directChildrenCount = getDirectChildrenCount(lazyFlatList, parentId);

  for (let siblingIndex = 0; siblingIndex < directChildrenCount; siblingIndex += 1) {
    if (remainingFlatRowIndex === 0) {
      return resolveSiblingRow(lazyFlatList, parentId, siblingIndex, depth);
    }

    remainingFlatRowIndex -= 1;

    const nodeId = buildSiblingId(parentId, siblingIndex);
    const nodeMeta = getNodeMeta(lazyFlatList, nodeId);

    if (lazyFlatList.expandedIds.includes(nodeId) && nodeMeta.hasChildren) {
      const expandedChildrenCount = getDirectChildrenCount(lazyFlatList, nodeId);

      if (remainingFlatRowIndex < expandedChildrenCount) {
        return findLazyFlatRowByIndex(
          lazyFlatList,
          remainingFlatRowIndex,
          nodeId,
          depth + 1,
        );
      }

      remainingFlatRowIndex -= expandedChildrenCount;
    }
  }

  return null;
}

function buildFilteredVisibleRows(
  treeNodes: IncidentTreeNode[],
  expandedIds: string[],
  depth: number,
): IncidentVisibleRow[] {
  const visibleRows: IncidentVisibleRow[] = [];

  for (const treeNode of treeNodes) {
    const { children, ...nodeWithoutChildren } = treeNode;
    visibleRows.push({
      ...nodeWithoutChildren,
      hasChildren: Boolean(children?.length),
      depth,
    });

    if (children?.length && expandedIds.includes(treeNode.id)) {
      visibleRows.push(...buildFilteredVisibleRows(children, expandedIds, depth + 1));
    }
  }

  return visibleRows;
}

/** Сколько строк в flat-списке (корни + раскрытые дети) — для высоты скролла */
export function getFlatRowCountLazy(lazyFlatList: LazyFlatListContext): number {
  return countVisibleFlatRowsUnderParent(lazyFlatList, INCIDENTS_ROOT_PARENT_ID);
}

/** Строка по индексу в flat-списке; O(глубина × позиция) без полного массива */
export function resolveFlatRowAtLazy(
  flatRowIndex: number,
  lazyFlatList: LazyFlatListContext,
): IncidentTableRow | null {
  if (flatRowIndex < 0) {
    return null;
  }

  return findLazyFlatRowByIndex(lazyFlatList, flatRowIndex);
}

export function getFlatRowCountFiltered(filteredFlatList: FilteredFlatListContext): number {
  return buildFilteredVisibleRows(filteredFlatList.items, filteredFlatList.expandedIds, 0).length;
}

export function resolveFlatRowAtFiltered(
  flatRowIndex: number,
  filteredFlatList: FilteredFlatListContext,
): IncidentTableRow | null {
  const visibleRows = buildFilteredVisibleRows(
    filteredFlatList.items,
    filteredFlatList.expandedIds,
    0,
  );

  return visibleRows[flatRowIndex] ?? null;
}
