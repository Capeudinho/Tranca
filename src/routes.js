const {Router} = require ("express");
const UserController = require ("./controllers/UserController");
const GroupController = require ("./controllers/GroupController");
const LockController = require ("./controllers/LockController");
const RoleController = require ("./controllers/RoleController");
const CentralController = require ("./controllers/CentralController");
const LogController = require ("./controllers/LogController");

const routes = Router ();

routes.get ("/userlist", UserController.list);
routes.get ("/userlistpag", UserController.listpag);
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
routes.put ("/groupidupdatemove", GroupController.idupdatemove);
routes.delete ("/groupiddestroy", GroupController.iddestroy);

routes.get ("/locklist", LockController.list);
routes.get ("/lockidindex", LockController.idindex);
routes.post ("/lockstore", LockController.store);
routes.put ("/lockidupdate", LockController.idupdate);
routes.put ("/lockidupdatesimp", LockController.idupdatesimp);
routes.delete ("/lockiddestroy", LockController.iddestroy);

routes.get ("/rolelist", RoleController.list);
routes.get ("/rolelistpag", RoleController.listpag);
routes.get ("/roleidindex", RoleController.idindex);
routes.post ("/rolestore", RoleController.store);
routes.put ("/roleidupdate", RoleController.idupdate);
routes.delete ("/roleiddestroy", RoleController.iddestroy);

routes.get ("/centrallist", CentralController.list);
routes.get ("/centralidindex", CentralController.idindex);
routes.get ("/centralloginindex", CentralController.loginindex);
routes.get ("/centralemailindex", CentralController.emailindex);
routes.post ("/centralstore", CentralController.store);
routes.put ("/centralidupdate", CentralController.idupdate);
routes.delete ("/centraliddestroy", CentralController.iddestroy);

routes.get ("/loglist", LogController.list);
routes.get ("/loglistpag", LogController.listpag);
routes.get ("/logidindex", LogController.idindex);
routes.post ("/logstore", LogController.store);
routes.put ("/logidupdate", LogController.idupdate)
routes.delete ("/logiddestroy", LogController.iddestroy);

module.exports = routes;