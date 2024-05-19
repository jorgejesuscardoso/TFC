import GetMatches from './Matches';
import FilterRepeated, { OrdenatedLeaderboard } from './filterArray';
import
ReduceLeaderboard,
{
  ReduceLeaderboardAway,
  Team,
  TeamAway,
  addLostGamesAndPoints,
  removeIndiceReducer,
  removeIndiceReducerAway,
} from './reduce';

const homes = async (teams: Team[]) => {
  try {
    const goalsAndGames = ReduceLeaderboard(teams) as unknown as [];
    const fixInd = removeIndiceReducer({ teams, goalsAndGames });
    const finalData = addLostGamesAndPoints(fixInd);
    const filterRepeated = FilterRepeated(finalData);
    const ordenated = OrdenatedLeaderboard(filterRepeated);
    return ordenated;
  } catch (error) {
    return { message: error };
  }
};

const aways = async (teams: TeamAway[]) => {
  try {
    const goalsAndGames = ReduceLeaderboardAway(teams) as unknown as [];
    const fixInd = removeIndiceReducerAway({ teams, goalsAndGames });
    const finalData = addLostGamesAndPoints(fixInd);
    const filterRepeated = FilterRepeated(finalData);
    const ordenated = OrdenatedLeaderboard(filterRepeated);
    return ordenated;
  } catch (error) {
    return { message: error };
  }
};
interface LeaderBoard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

const initializeTeam = (name: string) => ({
  name,
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: '0',
});

const updateTeamStats = (team: LeaderBoard, stats: LeaderBoard): LeaderBoard => {
  const updatedTeam: LeaderBoard = {
    ...team,
    totalPoints: team.totalPoints + stats.totalPoints,
    totalGames: team.totalGames + stats.totalGames,
    totalVictories: team.totalVictories + stats.totalVictories,
    totalDraws: team.totalDraws + stats.totalDraws,
    totalLosses: team.totalLosses + stats.totalLosses,
    goalsFavor: team.goalsFavor + stats.goalsFavor,
    goalsOwn: team.goalsOwn + stats.goalsOwn,
    goalsBalance: team.goalsBalance + (stats.goalsFavor - stats.goalsOwn),
  };

  return updatedTeam;
};

const calculateEfficiency = (team: LeaderBoard): LeaderBoard => {
  const efficiencyValue = ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2);
  return {
    ...team,
    efficiency: efficiencyValue,
  };
};

const teamFiltration = (teams: LeaderBoard[]) => {
  const filtered: { [key: string]: LeaderBoard } = {};

  teams.forEach((team) => {
    if (team.name) {
      if (!filtered[team.name]) {
        filtered[team.name] = initializeTeam(team.name);
      }
      filtered[team.name] = updateTeamStats(filtered[team.name], team);
      filtered[team.name] = calculateEfficiency(filtered[team.name]);
    }
  });

  return Object.values(filtered);
};

export default class LeaderboardAll {
  constructor(
    private getMatches = new GetMatches(),
  ) { }

  public async Leaderboards() {
    const home = await this.getMatches.allMatchsHome() as unknown as Team[];
    const away = await this.getMatches.allMatchsAway() as unknown as TeamAway[];
    const reduceHome = await homes(home) as [];
    const reduceAway = await aways(away) as [];
    const concat = reduceHome.concat(reduceAway);
    const filtered = teamFiltration(concat);
    const ordenated = OrdenatedLeaderboard(filtered);
    return ordenated;
  }
}
