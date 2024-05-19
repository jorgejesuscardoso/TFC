import { Router } from 'express';
import TeamRouter from './team.routes';
import UserRouter from './user.routes';
import MatchesRouter from './matches.routes';
import Leaderboard from './leaderboard';

const router = Router();

router.use('/teams', TeamRouter);
router.use('/login', UserRouter);
router.use('/login/role', UserRouter);
router.use('/matches', MatchesRouter);
router.use('/matches/:id', MatchesRouter);
router.use('/leaderboard', Leaderboard);

export default router;
