import { Router, Request, Response } from 'express';
import MatchesController from '../controller/MatchesController';
import { TokenValidation } from '../middlewares/validations';

const matchesCotroller = new MatchesController();

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => matchesCotroller.findAllMatches(req, res),
);
router.patch(
  '/:id/finish',
  TokenValidation,
  (req: Request, res: Response) => matchesCotroller.finishMatchById(req, res),
);
router.patch(
  '/:id',
  TokenValidation,
  (req: Request, res: Response) => matchesCotroller.upDateGoals(req, res),
);
router.post(
  '/',
  TokenValidation,
  (req: Request, res: Response) => matchesCotroller.createMatch(req, res),
);
router.get(
  '/:id',
  (req: Request, res: Response) => matchesCotroller.findMatchById(req, res),
);

export default router;
