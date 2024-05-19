import { Router, Request, Response } from 'express';
import MatchesController from '../controller/MatchesController';

const leaderboard = new MatchesController();

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => leaderboard.Leaderboard(req, res),
);
router.get(
  '/home',
  (req: Request, res: Response) => leaderboard.leaderBoardHome(req, res),
);
router.get(
  '/away',
  (req: Request, res: Response) => leaderboard.leaderBoardAway(req, res),
);
export default router;
