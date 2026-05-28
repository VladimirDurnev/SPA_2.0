function filterTreeByCriticality(nodes, filter) {
  return nodes.reduce((acc, node) => {
    const filteredChildren = node.children
      ? filterTreeByCriticality(node.children, filter)
      : undefined;

    const isIncidentRow = Boolean(
      node.criticality
      || node.incidentState
      || node.malfunction
      || node.deadline != null
      || node.durationDays != null,
    );

    const matches = filter === 'unspecified'
      ? !node.criticality && isIncidentRow
      : node.criticality === filter;

    const keep = matches || Boolean(filteredChildren?.length);

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

module.exports = { filterTreeByCriticality };
