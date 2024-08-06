import UserController from '../controllers/UserController';
import AuthController from "../controllers/AuthController";
import SiteController from "../controllers/SiteController";

function controllerRouting(app) {
  // User Controller
  app.post('/users', UserController.createNew);
  app.get('/users/me', UserController.getMe);

  // Auth Controller
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);

  // Site Controller
  app.post('/sites', SiteController.newSite);
  app.put('/sites/:id/vote', SiteController.voteSite);
  app.put('/sites/:id/unvote', SiteController.unvoteSite);
  app.put('/sites/:id/update', SiteController.updateSiteCategory);
  app.get('/sites', SiteController.searchSites);
  app.get('/sites/all', SiteController.getAllSites);

  // Admin Controls
  app.delete('/users/destroy', UserController.deleteUser);
  app.delete('/sites/:id/delete', SiteController.deleteSite);
  app.post('/category', SiteController.createCategory);
  app.delete('/category', SiteController.deleteCategory);
  app.get('/category', SiteController.getCategories);
}

export default controllerRouting;
