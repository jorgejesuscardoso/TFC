import { Router, Request, Response } from 'express';
import TeamController from '../controller/TeamController';

const teamCotroller = new TeamController();

const router = Router();

router.get(
  '/',
  (req: Request, res: Response) => teamCotroller.getAllTeams(req, res),
);
router.get('/:id', (req: Request, res: Response) => teamCotroller.getTeamById(req, res));

export default router;
