import IMatches from '../Interfaces/IMatches';
import TeamService from '../services/TeamService';
import MatchesService from '../services/MatchesService';

type TeamMatch = {
  homeTeam: number;
  awayTeam: number;
};
export type OutPut = {
  message?: string;
  status?: number;
  isValid?: boolean;
};
type Team = {
  data: {
    teamName: string;
  };
};
export default class GetMatches {
  constructor(
    private teamsService: TeamService = new TeamService(),
    private matchesService: MatchesService = new MatchesService(),
  ) { }

  public async getAllMatches(allMatches: IMatches[]) {
    if (allMatches) {
      const matches = await Promise.all(allMatches.map(async (s) => {
        const homeTeam = await this.teamsService.getTeamById(s.homeTeamId);
        const awayTeam = await this.teamsService.getTeamById(s.awayTeamId);
        const homeNoId = { ...homeTeam.data, id: undefined };
        const awayNoId = { ...awayTeam.data, id: undefined };
        return { ...s, homeTeam: homeNoId, awayTeam: awayNoId };
      }));
      return matches;
    }
  }

  public async ValidateMatch({ homeTeam, awayTeam }: TeamMatch): Promise<OutPut | boolean> {
    if (homeTeam === awayTeam) {
      return {
        message: 'It is not possible to create a match with two equal teams', status: 422 };
    }
    const hasTeam = await Promise.all([
      this.teamsService.getTeamById(homeTeam),
      this.teamsService.getTeamById(awayTeam),
    ]);
    if (hasTeam.some((team) => team.status === 'NOT_FOUND')) {
      return { message: 'There is no team with such id!', status: 404 };
    }
    return { isValid: true };
  }

  public async allMatchsHome() {
    try {
      const allMatches = await this.matchesService.findAllMatches() as IMatches[];
      const matchesFinished = allMatches.filter((match) => match.inProgress === false);

      const matchesByTeam = await Promise.all(matchesFinished.map(async (match) => {
        const teams = await this.teamsService.getTeamById(match.homeTeamId) as Team;
        return {
          name: teams.data.teamName,
          ...match,
        };
      }));
      return matchesByTeam;
    } catch (error) {
      return { message: error };
    }
  }

  public async allMatchsAway() {
    try {
      const allMatches = await this.matchesService.findAllMatches() as IMatches[];
      const matchesFinished = allMatches.filter((match) => match.inProgress === false);

      const matchesByTeam = await Promise.all(matchesFinished.map(async (match) => {
        const teams = await this.teamsService.getTeamById(match.awayTeamId) as Team;
        return {
          name: teams.data.teamName,
          ...match,
        };
      }));
      return matchesByTeam;
    } catch (error) {
      return { message: error };
    }
  }
}
