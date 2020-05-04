const {Router} = require ("express");
const CentralController = require ("./controllers/CentralController");
const UserController = require ("./controllers/UserController");
const LockController = require ("./controllers/LockController");

const routes = Router ();

routes.get ("/centrals", CentralController.list);
routes.get ("/centrals", CentralController.index);
routes.post ("/centrals", CentralController.store);
routes.delete ("/centrals", CentralController.destroy);

routes.get ("/userlist", UserController.list);
routes.get ("/userlistpag", UserController.listpag);
routes.get ("/usernamelistpag", UserController.namelistpag);
routes.get ("/useridindex", UserController.idindex);
routes.post ("/userstore", UserController.store);
routes.put ("/useridupdate", UserController.idupdate)
routes.delete ("/useriddestroy", UserController.iddestroy);

routes.get ("/locks", LockController.list);
routes.get ("/locks", LockController.index);
routes.post ("/locks", LockController.store);
routes.delete ("/locks", LockController.destroy);

module.exports = routes;