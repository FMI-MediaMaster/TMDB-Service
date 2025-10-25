import { Router } from 'express';
import tmdbRouter from '@routes/tmdb';

const routes: Router = Router();

routes.use('/', tmdbRouter);

export default routes;

