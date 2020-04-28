const {Router} = require ("express");
const CentralController = require ("./controllers/CentralController");
const UserController = require ("./controllers/UserController");
const LockController = require ("./controllers/LockController");

const routes = Router ();

routes.get ("/centrals", CentralController.list);
routes.get ("/centrals", CentralController.index);
routes.post ("/centrals", CentralController.store);
routes.delete ("/centrals", CentralController.destroy);

routes.get ("/users", UserController.list);
routes.get ("/searchuser", UserController.index);
routes.post ("/users", UserController.store);
routes.delete ("/users", UserController.destroy);

routes.get ("/locks", LockController.list);
routes.get ("/locks", LockController.index);
routes.post ("/locks", LockController.store);
routes.delete ("/locks", LockController.destroy);

module.exports = routes;