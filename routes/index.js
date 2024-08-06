import UserController from '../controllers/UserController';
import AuthController from "../controllers/AuthController";
import SiteController from "../controllers/SiteController";
import authenticateUser from "../utils/authUtils";
import handleUnauthorized from "../utils/errorUtils";

// Middleware to handle errors
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
}

function ensureAuthenticated(req, res, next) {
  authenticateUser(req)
    .then(userId => {
      if (!userId) {
        return handleUnauthorized(res);
      }
      req.userId = userId;
      next();
    })
    .catch(err => next(err));
}

function controllerRouting(app) {
  // User Controller
  app.post('/users', UserController.createNew);
  app.get('/users/me', ensureAuthenticated, UserController.getMe);

  // Auth Controller
  app.post('/connect', AuthController.getConnect);
  app.delete('/disconnect', AuthController.getDisconnect);

  // Site Controller
  app.post('/sites', ensureAuthenticated, SiteController.newSite);
  app.put('/sites/:id/vote', ensureAuthenticated, SiteController.voteSite);
  app.put('/sites/:id/unvote', ensureAuthenticated, SiteController.unvoteSite);
  app.put('/sites/:id/update', ensureAuthenticated, SiteController.updateSiteCategory);
  app.get('/sites', SiteController.searchSites);
  app.get('/sites/all', SiteController.getAllSites);

  // Admin Controls
  app.delete('/users/destroy', ensureAuthenticated, UserController.deleteUser);
  app.delete('/sites/:id/delete', ensureAuthenticated, SiteController.deleteSite);
  app.post('/category', ensureAuthenticated, SiteController.createCategory);
  app.delete('/category', ensureAuthenticated, SiteController.deleteCategory);
  app.get('/category', SiteController.getCategories);

  // Error handling middleware
  app.use(errorHandler);
}

export default controllerRouting;
