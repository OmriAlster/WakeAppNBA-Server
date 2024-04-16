// routes/userRoutes.ts
import { Router } from 'express';
import gamesController from '../controllers/gamesController';

const router: Router = Router();

router.get('/', gamesController.getGamesBetweenDates);

export default router;
