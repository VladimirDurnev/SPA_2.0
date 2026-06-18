const jsonServer = require('json-server');
const incidentsTreeMock = require('./incidentsTreeMock.cjs');

const server = jsonServer.create();
const router = jsonServer.router('mock/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

/** GET /incidentsTree/aggregates — бублики без обхода дерева */
server.use((req, res, next) => {
  if (req.method !== 'GET' || req.path !== '/incidentsTree/aggregates') {
    next();
    return;
  }

  res.jsonp(incidentsTreeMock.getAggregates());
});

/** GET /incidentsTree/nodes?parentId=&page=&pageSize= — lazy-дети */
server.use((req, res, next) => {
  if (req.method !== 'GET' || req.path !== '/incidentsTree/nodes') {
    next();
    return;
  }

  const parentId = req.query.parentId ?? null;
  const offset = Number(req.query.offset ?? 0);
  const limit = Number(req.query.limit ?? 100);

  res.jsonp(incidentsTreeMock.getChildrenRange(parentId, offset, limit));
});

/** GET /incidentsTree?criticality=… — отфильтрованное поддерево */
server.use((req, res, next) => {
  if (req.method !== 'GET' || req.path !== '/incidentsTree') {
    next();
    return;
  }

  const { criticality } = req.query;

  if (criticality) {
    const filtered = incidentsTreeMock.filterTreeByCriticality(criticality);
    res.jsonp({
      defaultExpandedRowKeys: [],
      ...filtered,
    });
    return;
  }

  res.jsonp(incidentsTreeMock.getRootTreeMetaResponse());
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.warn(`JSON Server http://localhost:${PORT}`);
  console.warn(
    `[mock] incidents tree: ${incidentsTreeMock.LEVEL_0_COUNT} roots, `
    + `${incidentsTreeMock.TOTAL_NODES} nodes (lazy /incidentsTree/nodes)`,
  );
});
