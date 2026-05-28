const jsonServer = require('json-server');
const { filterTreeByCriticality } = require('./filterIncidentsTree.cjs');

const server = jsonServer.create();
const router = jsonServer.router('mock/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

/** GET /incidentsTree?criticality=high — отфильтрованное дерево для таблицы */
server.use((req, res, next) => {
  if (req.method !== 'GET' || req.path !== '/incidentsTree') {
    next();
    return;
  }

  const { criticality } = req.query;
  if (!criticality) {
    next();
    return;
  }

  const tree = router.db.get('incidentsTree').value();
  res.jsonp({
    ...tree,
    items: filterTreeByCriticality(tree.items, criticality),
  });
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.warn(`JSON Server http://localhost:${PORT}`);
});
