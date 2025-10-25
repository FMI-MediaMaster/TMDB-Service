import { Router } from 'express';
import tmdbController from '@controllers/tmdb';

const router: Router = Router();

router.get('/:type/:method', tmdbController.handler);

export default router;
