import type { IncidentTreeNode } from '../../types';

export function collectExpandedIds(treeNodes: IncidentTreeNode[]): string[] {
  const expandedNodeIds: string[] = [];

  function visitNestedNodes(nodes: IncidentTreeNode[]) {
    for (const treeNode of nodes) {
      if (treeNode.children?.length) {
        expandedNodeIds.push(treeNode.id);
        visitNestedNodes(treeNode.children);
      }
    }
  }

  visitNestedNodes(treeNodes);
  return expandedNodeIds;
}

export function collectNodeMeta(treeNodes: IncidentTreeNode[]): Record<string, { hasChildren: boolean }> {
  const nodeMetaById: Record<string, { hasChildren: boolean }> = {};

  function visitNestedNodes(nodes: IncidentTreeNode[]) {
    for (const treeNode of nodes) {
      nodeMetaById[treeNode.id] = { hasChildren: Boolean(treeNode.children?.length) };
      if (treeNode.children?.length) {
        visitNestedNodes(treeNode.children);
      }
    }
  }

  visitNestedNodes(treeNodes);
  return nodeMetaById;
}
