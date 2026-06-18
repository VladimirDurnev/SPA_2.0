import type { IncidentCriticality, IncidentTreeNode } from '../../types';

export type CriticalityFilterValue = IncidentCriticality | 'unspecified';

function isIncidentRow(node: IncidentTreeNode) {
  return Boolean(
    node.criticality
    || node.incidentState
    || node.malfunction
    || node.deadline != null
    || node.durationDays != null,
  );
}

function nodeMatches(node: IncidentTreeNode, filter: CriticalityFilterValue) {
  if (filter === 'unspecified') {
    return !node.criticality && isIncidentRow(node);
  }
  return node.criticality === filter;
}

/**
 * Оставляет ветки дерева, где есть узлы с выбранной критичностью
 * (сам узел или потомок).
 */
export function filterTreeByCriticality(
  nodes: IncidentTreeNode[],
  filter: CriticalityFilterValue,
): IncidentTreeNode[] {
  return nodes.reduce<IncidentTreeNode[]>((matchingNodes, treeNode) => {
    const filteredChildren = treeNode.children
      ? filterTreeByCriticality(treeNode.children, filter)
      : undefined;

    const keep
      = nodeMatches(treeNode, filter)
        || Boolean(filteredChildren?.length);

    if (!keep) {
      return matchingNodes;
    }

    matchingNodes.push({
      ...treeNode,
      children: filteredChildren?.length ? filteredChildren : undefined,
    });
    return matchingNodes;
  }, []);
}
