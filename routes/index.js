import UserController from '../controllers/UserController'
import AuthController from "../controllers/AuthController";

function controllerRouting(app) {
  // User Controller
  app.post('/users', UserController.createNew);
  app.get('/users/me', UserController.getMe);
  app.delete('/users/destroy', UserController.deleteUser);

  // Auth Controller
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);
}

export default controllerRouting;