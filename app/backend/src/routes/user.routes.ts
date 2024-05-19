import { Router, Request, Response } from 'express';
import UserController from '../controller/UserController';
import { TokenValidation, validateLogin } from '../middlewares/validations';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  validateLogin,
  (req: Request, res: Response) => userController.Login(req, res),
);
router.get(
  '/role',
  TokenValidation,
  (req: Request, res: Response) => userController.FindRoleByUserId(req, res),
);
export default router;
