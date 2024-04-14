// routes/userRoutes.ts
import { Router } from 'express';
import userController from '../controllers/userController';

const router: Router = Router();

router.get('/', userController.getAllUsers);

export default router;
