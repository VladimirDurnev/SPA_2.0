/**
 * Mock дерева инцидентов — без отдельных скриптов генерации.
 * Узлы материализуются по запросу (id → поля), дерево целиком в память не строится.
 *
 * Структура:
 * - уровень 1: 1000 корней (r-0 … r-999)
 * - r-0 (первый родитель): 1000 дочерних листьев без вложенности (для тестов скролла)
 * - индексы 1,2 / 500,501,502 / 997,998,999 — по 100 детей + 2 уровня × 10
 */

const LEVEL_0_COUNT = 1_000;
const SPECIAL_CHILDREN = 100;
const DEEP_CHILDREN = 10;
const FLAT_TEST_ROOT_INDEX = 0;
const FLAT_TEST_CHILDREN = 1_000;
const FILTER_RESULT_LIMIT = 2_000;
const ROOT_KEY = '__root__';

const SPECIAL_ROOT_INDICES = new Set([
  0,
  1,
  2,
  500,
  501,
  502,
  LEVEL_0_COUNT - 3,
  LEVEL_0_COUNT - 2,
  LEVEL_0_COUNT - 1,
]);

const LEVEL_NAMES = ['АЗС', 'Блок', 'ТГ', 'Инцидент'];
const CRITICALITIES = ['high', 'medium', 'low'];
const INCIDENT_STATES = ['model', 'equipment', 'sensor'];
const MALFUNCTIONS = ['ПОДШ', 'Дисбаланс', 'Проблема системы смазки'];

const DEEP_BRANCH_NODES = SPECIAL_CHILDREN
  + SPECIAL_CHILDREN * DEEP_CHILDREN
  + SPECIAL_CHILDREN * DEEP_CHILDREN * DEEP_CHILDREN;

const DEEP_SPECIAL_ROOT_COUNT = SPECIAL_ROOT_INDICES.size - 1;

const TOTAL_NODES = LEVEL_0_COUNT + FLAT_TEST_CHILDREN + DEEP_SPECIAL_ROOT_COUNT * DEEP_BRANCH_NODES;

function isFlatTestRoot(rootIndex) {
  return rootIndex === FLAT_TEST_ROOT_INDEX;
}

function isSpecialRootIndex(rootIndex) {
  return SPECIAL_ROOT_INDICES.has(rootIndex);
}

function buildNodeId(rootIndex, childPath = []) {
  let id = `r-${rootIndex}`;
  for (const index of childPath) {
    id += `-c${index}`;
  }
  return id;
}

function parseNodeId(id) {
  if (!id || !id.startsWith('r-')) {
    return null;
  }

  const segments = id.slice(2).split('-c');
  const rootIndex = Number(segments[0]);

  if (!Number.isInteger(rootIndex) || rootIndex < 0 || rootIndex >= LEVEL_0_COUNT) {
    return null;
  }

  const childPath = segments.slice(1).map(part => Number(part));

  if (childPath.some(part => !Number.isInteger(part) || part < 0)) {
    return null;
  }

  return { rootIndex, childPath };
}

function getDepth(childPath) {
  return childPath.length;
}

function getChildCount(rootIndex, childPath) {
  const depth = getDepth(childPath);

  if (depth === 0) {
    if (isFlatTestRoot(rootIndex)) {
      return FLAT_TEST_CHILDREN;
    }

    return isSpecialRootIndex(rootIndex) ? SPECIAL_CHILDREN : 0;
  }

  if (isFlatTestRoot(rootIndex)) {
    return 0;
  }

  if (depth === 1 || depth === 2) {
    return DEEP_CHILDREN;
  }

  return 0;
}

function hasChildren(rootIndex, childPath) {
  return getChildCount(rootIndex, childPath) > 0;
}

function durationBucket(days) {
  if (days < 7)
    return 'less-week';
  if (days < 21)
    return 'weeks-1-2';
  if (days < 36)
    return 'weeks-3-5';
  if (days < 57)
    return 'weeks-6-8';
  return 'more-8';
}

function computeLeafIndex(rootIndex, childPath) {
  if (childPath.length === 0) {
    return rootIndex;
  }

  const [c1, c2 = 0, c3 = 0] = childPath;
  return rootIndex * 100_000 + c1 * 1_000 + c2 * DEEP_CHILDREN + c3;
}

function computeTotalIncidents(rootIndex, childPath) {
  const depth = getDepth(childPath);

  if (!isSpecialRootIndex(rootIndex) && depth === 0) {
    return 1;
  }

  if (depth === 0 && isFlatTestRoot(rootIndex)) {
    return FLAT_TEST_CHILDREN;
  }

  if (depth === 0) {
    return SPECIAL_CHILDREN * DEEP_CHILDREN * DEEP_CHILDREN;
  }

  if (depth === 1) {
    return DEEP_CHILDREN * DEEP_CHILDREN;
  }

  if (depth === 2) {
    return DEEP_CHILDREN;
  }

  return 1;
}

function buildName(rootIndex, childPath) {
  const depth = getDepth(childPath);

  if (depth === 0) {
    return `${LEVEL_NAMES[0]} ${rootIndex + 1}`;
  }

  if (depth === 1) {
    return `${LEVEL_NAMES[1]} ${rootIndex + 1}.${childPath[0] + 1}`;
  }

  if (depth === 2) {
    return `${LEVEL_NAMES[2]} ${rootIndex + 1}.${childPath[0] + 1}.${childPath[1] + 1}`;
  }

  return `${LEVEL_NAMES[3]} ${rootIndex + 1}.${childPath[0] + 1}.${childPath[1] + 1}.${childPath[2] + 1}`;
}

function applyLeafFields(node, leafIndex) {
  node.criticality = CRITICALITIES[leafIndex % CRITICALITIES.length];
  node.incidentState = INCIDENT_STATES[leafIndex % INCIDENT_STATES.length];
  node.malfunction = MALFUNCTIONS[leafIndex % MALFUNCTIONS.length];
  node.deadline = '18.12.2022 18:00';
  node.durationDays = (leafIndex % 60) + 1;
  node.totalIncidents = 1;

  if (leafIndex % 5 === 0) {
    node.cmState = 'active';
  }
}

function materializeNode(rootIndex, childPath) {
  const id = buildNodeId(rootIndex, childPath);
  const node = {
    id,
    name: buildName(rootIndex, childPath),
    hasChildren: hasChildren(rootIndex, childPath),
  };

  if (node.hasChildren) {
    node.cmState = 'active';
    node.totalIncidents = computeTotalIncidents(rootIndex, childPath);
    return node;
  }

  applyLeafFields(node, computeLeafIndex(rootIndex, childPath));
  return node;
}

function materializeNodeById(id) {
  const ref = parseNodeId(id);
  if (!ref) {
    return null;
  }

  return materializeNode(ref.rootIndex, ref.childPath);
}

function normalizeParentId(parentId) {
  if (parentId == null || parentId === '' || parentId === ROOT_KEY) {
    return null;
  }

  return parentId;
}

function getChildIds(parentId) {
  const normalizedParentId = normalizeParentId(parentId);

  if (normalizedParentId === null) {
    return Array.from({ length: LEVEL_0_COUNT }, (_, index) => buildNodeId(index));
  }

  const ref = parseNodeId(normalizedParentId);
  if (!ref) {
    return [];
  }

  const count = getChildCount(ref.rootIndex, ref.childPath);
  return Array.from({ length: count }, (_, index) =>
    buildNodeId(ref.rootIndex, [...ref.childPath, index]));
}

function toLazyListItem(node) {
  return { ...node };
}

function toNestedListItem(node) {
  const { hasChildren, ...rest } = node;
  return rest;
}

function getChildrenRange(parentId, offset = 0, limit = 100) {
  const normalizedParentId = normalizeParentId(parentId);
  const total = normalizedParentId === null
    ? LEVEL_0_COUNT
    : (() => {
        const ref = parseNodeId(normalizedParentId);
        return ref ? getChildCount(ref.rootIndex, ref.childPath) : 0;
      })();

  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, limit);
  const end = Math.min(total, safeOffset + safeLimit);

  const items = [];
  for (let index = safeOffset; index < end; index += 1) {
    if (normalizedParentId === null) {
      items.push(toLazyListItem(materializeNode(index, [])));
      continue;
    }

    const ref = parseNodeId(normalizedParentId);
    items.push(toLazyListItem(materializeNode(ref.rootIndex, [...ref.childPath, index])));
  }

  return {
    parentId: normalizedParentId,
    items,
    offset: safeOffset,
    limit: safeLimit,
    total,
  };
}

function forEachLeaf(visitor) {
  for (let rootIndex = 0; rootIndex < LEVEL_0_COUNT; rootIndex += 1) {
    if (isFlatTestRoot(rootIndex)) {
      for (let c1 = 0; c1 < FLAT_TEST_CHILDREN; c1 += 1) {
        visitor({ rootIndex, childPath: [c1] });
      }
      continue;
    }

    if (!isSpecialRootIndex(rootIndex)) {
      visitor({ rootIndex, childPath: [] });
      continue;
    }

    for (let c1 = 0; c1 < SPECIAL_CHILDREN; c1 += 1) {
      for (let c2 = 0; c2 < DEEP_CHILDREN; c2 += 1) {
        for (let c3 = 0; c3 < DEEP_CHILDREN; c3 += 1) {
          visitor({ rootIndex, childPath: [c1, c2, c3] });
        }
      }
    }
  }
}

let aggregatesCache = null;

function getAggregates() {
  if (aggregatesCache) {
    return aggregatesCache;
  }

  const criticality = { high: 0, medium: 0, low: 0, unspecified: 0 };
  const incidentState = { model: 0, equipment: 0, sensor: 0 };
  const duration = {
    'less-week': 0,
    'weeks-1-2': 0,
    'weeks-3-5': 0,
    'weeks-6-8': 0,
    'more-8': 0,
  };

  forEachLeaf(({ rootIndex, childPath }) => {
    const leafIndex = computeLeafIndex(rootIndex, childPath);
    const crit = CRITICALITIES[leafIndex % CRITICALITIES.length];
    criticality[crit] += 1;
    incidentState[INCIDENT_STATES[leafIndex % INCIDENT_STATES.length]] += 1;
    duration[durationBucket((leafIndex % 60) + 1)] += 1;
  });

  aggregatesCache = {
    totalNodes: TOTAL_NODES,
    criticality,
    incidentState,
    duration,
  };

  return aggregatesCache;
}

function isIncidentRow(node) {
  return Boolean(
    node.criticality
    || node.incidentState
    || node.malfunction
    || node.deadline != null
    || node.durationDays != null,
  );
}

function nodeMatches(node, filter) {
  if (filter === 'unspecified') {
    return !node.criticality && isIncidentRow(node);
  }

  return node.criticality === filter;
}

function addAncestorsToSet(includeIds, rootIndex, childPath) {
  includeIds.add(buildNodeId(rootIndex));

  for (let depth = 1; depth <= childPath.length; depth += 1) {
    includeIds.add(buildNodeId(rootIndex, childPath.slice(0, depth)));
  }
}

function buildNestedNode(id, includeIds) {
  const ref = parseNodeId(id);
  const node = toNestedListItem(materializeNode(ref.rootIndex, ref.childPath));
  const childIds = getChildIds(id).filter(childId => includeIds.has(childId));

  if (childIds.length > 0) {
    node.children = childIds.map(childId => buildNestedNode(childId, includeIds));
  }

  return node;
}

function buildNestedFromIds(includeIds) {
  const items = [];

  for (let rootIndex = 0; rootIndex < LEVEL_0_COUNT; rootIndex += 1) {
    const rootId = buildNodeId(rootIndex);
    if (!includeIds.has(rootId)) {
      continue;
    }

    items.push(buildNestedNode(rootId, includeIds));
  }

  return items;
}

function filterTreeByCriticality(filter) {
  const includeIds = new Set();
  let matchCount = 0;

  forEachLeaf(({ rootIndex, childPath }) => {
    const node = materializeNode(rootIndex, childPath);
    if (!nodeMatches(node, filter)) {
      return;
    }

    matchCount += 1;
    addAncestorsToSet(includeIds, rootIndex, childPath);
  });

  const truncated = includeIds.size > FILTER_RESULT_LIMIT;
  const limitedIds = truncated
    ? new Set([...includeIds].slice(0, FILTER_RESULT_LIMIT))
    : includeIds;

  return {
    items: buildNestedFromIds(limitedIds),
    meta: {
      matchCount,
      truncated,
      returnedNodes: limitedIds.size,
      totalNodes: TOTAL_NODES,
    },
  };
}

/** Для GET /incidentsTree без фильтра — только meta, без полного дерева в JSON */
function getRootTreeMetaResponse() {
  return {
    defaultExpandedRowKeys: [],
    meta: {
      totalNodes: TOTAL_NODES,
      rootCount: LEVEL_0_COUNT,
      lazy: true,
    },
    items: [],
  };
}

module.exports = {
  FILTER_RESULT_LIMIT,
  LEVEL_0_COUNT,
  FLAT_TEST_CHILDREN,
  FLAT_TEST_ROOT_INDEX,
  SPECIAL_CHILDREN,
  DEEP_CHILDREN,
  SPECIAL_ROOT_INDICES,
  TOTAL_NODES,
  buildNodeId,
  filterTreeByCriticality,
  getAggregates,
  getChildrenRange,
  getRootTreeMetaResponse,
  materializeNodeById,
};
