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
  return nodes.reduce<IncidentTreeNode[]>((acc, node) => {
    const filteredChildren = node.children
      ? filterTreeByCriticality(node.children, filter)
      : undefined;

    const keep
      = nodeMatches(node, filter)
        || Boolean(filteredChildren?.length);

    if (!keep) {
      return acc;
    }

    acc.push({
      ...node,
      children: filteredChildren?.length ? filteredChildren : undefined,
    });
    return acc;
  }, []);
}
