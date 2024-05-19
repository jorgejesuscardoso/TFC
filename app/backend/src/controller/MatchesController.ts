import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';
import IMatches from '../Interfaces/IMatches';
import GetMatches, { OutPut } from '../utils/Matches';
import
ReduceLeaderboard,
{ addLostGamesAndPoints,
  ReduceLeaderboardAway,
  removeIndiceReducer,
  removeIndiceReducerAway,
  Team,
  TeamAway,
} from '../utils/reduce';
import FilterRepeated, { OrdenatedLeaderboard } from '../utils/filterArray';
import LeaderboardAll from '../utils/gambiarra';

export default class MatchesController {
  constructor(
    private matchesService: MatchesService = new MatchesService(),
    private leaderboardHome: GetMatches = new GetMatches(),
    private leaderboardAll: LeaderboardAll = new LeaderboardAll(),
  ) { }

  public async findAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    const allMatches = await this.matchesService.findAllMatches() as IMatches[];

    let filterMatches = allMatches;

    if (inProgress === 'true') {
      filterMatches = allMatches.filter((match) => match.inProgress === true);
    }

    if (inProgress === 'false') {
      filterMatches = allMatches.filter((match) => match.inProgress === false);
    }

    const getMatches = new GetMatches();
    const matchesFiltered = await getMatches.getAllMatches(filterMatches);

    return res.status(200).json(matchesFiltered);
  }

  public async findMatchById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await this.matchesService.findMatchById(+id);
      return res.status(200).json(match);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public async finishMatchById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await this.matchesService.findMatchById(+id) as IMatches;
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      } const matchObj = {
        id: match.id,
        awayTeamGoals: match.awayTeamGoals,
        awayTeamId: match.awayTeamId,
        homeTeamGoals: match.homeTeamGoals,
        homeTeamId: match.homeTeamId,
        inProgress: false,
      }; const updatedMatch = await this.matchesService.save(matchObj) as unknown as IMatches;
      const isFinished = updatedMatch.inProgress === false
        ? { message: 'Finished' } : { message: 'Error to finish match' };
      return res.status(200).json(isFinished);
    } catch (error) { return res.status(500).json(error); }
  }

  public async upDateGoals(req: Request, res: Response) {
    try {
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const { id } = req.params;
      const match = await this.matchesService.findMatchById(+id) as IMatches;
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      } const matchObj = {
        id: match.id,
        awayTeamGoals,
        awayTeamId: match.awayTeamId,
        homeTeamGoals,
        homeTeamId: match.homeTeamId,
        inProgress: match.inProgress,
      }; const updatedMatch = await this.matchesService.save(matchObj) as unknown as IMatches;
      return res.status(200).json(updatedMatch);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public async createMatch(req: Request, res: Response) {
    try {
      const match = req.body;
      const homeTeam = match.homeTeamId;
      const awayTeam = match.awayTeamId;
      const getMatches = new GetMatches();
      const { message, status } = await getMatches
        .ValidateMatch({ homeTeam, awayTeam }) as OutPut;
      if (message && status) {
        return res.status(status).json({ message });
      }
      const newMatch = await this.matchesService.createMatch(match);
      return res.status(201).json(newMatch);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public async leaderBoardHome(req: Request, res: Response) {
    try {
      const teams = await this.leaderboardHome.allMatchsHome() as unknown as Team[];
      const goalsAndGames = ReduceLeaderboard(teams) as unknown as [];
      const fixInd = removeIndiceReducer({ teams, goalsAndGames });
      const finalData = addLostGamesAndPoints(fixInd);
      const filterRepeated = FilterRepeated(finalData);
      const ordenated = OrdenatedLeaderboard(filterRepeated);
      return res.status(200).json(ordenated);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public async leaderBoardAway(req: Request, res: Response) {
    try {
      const teams = await this.leaderboardHome.allMatchsAway() as unknown as TeamAway[];
      const goalsAndGames = ReduceLeaderboardAway(teams) as unknown as [];
      const fixInd = removeIndiceReducerAway({ teams, goalsAndGames });
      const finalData = addLostGamesAndPoints(fixInd);
      const filterRepeated = FilterRepeated(finalData);
      const ordenated = OrdenatedLeaderboard(filterRepeated);
      return res.status(200).json(ordenated);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public async Leaderboard(req: Request, res: Response) {
    try {
      await this.matchesService.findAllMatches() as unknown as IMatches[];
      const leaderboard = await this.leaderboardAll.Leaderboards();
      return res.status(200).json(leaderboard);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
