import UserController from '../controllers/UserController'
import AuthController from "../controllers/AuthController";
import SiteController from "../controllers/SiteController";

function controllerRouting(app) {
  // User Controller
  app.post('/users', UserController.createNew);
  app.get('/users/me', UserController.getMe);
  app.delete('/users/destroy', UserController.deleteUser);

  // Auth Controller
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);

  // Site Controller
  app.post('/sites', SiteController.newSite);
}

export default controllerRouting;
