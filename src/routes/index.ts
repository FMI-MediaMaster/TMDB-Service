import tmdbController from '@controllers/tmdb';

const routes: Router = Router();

routes.get('/:type/:method', tmdbController.handler);

export default routes;

