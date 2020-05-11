const {Router} = require ("express");
const UserController = require ("./controllers/UserController");
const GroupController = require ("./controllers/GroupController");

const routes = Router ();

routes.get ("/userlist", UserController.list);
routes.get ("/userlistpag", UserController.listpag);
routes.get ("/usernamelistpag", UserController.namelistpag);
routes.get ("/useridindex", UserController.idindex);
routes.post ("/userstore", UserController.store);
routes.put ("/useridupdate", UserController.idupdate)
routes.delete ("/useriddestroy", UserController.iddestroy);

routes.get ("/grouplist", GroupController.list);
routes.get ("/groupidindex", GroupController.idindex);
routes.get ("/grouplevelindex", GroupController.levelindex);
routes.get ("/groupcontentindex", GroupController.contentindex);
routes.post ("/groupstore", GroupController.store);
routes.put ("/groupidupdate", GroupController.idupdate);
routes.put ("/groupidupdatesimp", GroupController.idupdatesimp);
routes.delete ("/groupiddestroy", GroupController.iddestroy);

module.exports = routes;