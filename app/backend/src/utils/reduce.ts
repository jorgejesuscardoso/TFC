export type Team = {
  name: string;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
};
export type TeamAway = {
  name: string;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
};
type GoalsAndGames = {
  name: string;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  goalsFavor: number;
  goalsOwn: number;
};

export type GetMatches2 = {
  teams: TeamAway[];
  goalsAndGames: [];
};
export type GetMatches = {
  teams: Team[];
  goalsAndGames: [];
};
type TeamFiltered = { [key: number]: {
  name: string; totalGames: number,
  goalsFavor: number, totalVictories: number, totalDraws: number, goalsOwn: number } };

const ReduceLeaderboard = (teams: Team[]) => {
  const teamsFiltered = teams.reduce((acc, team) => {
    const { name } = team;
    const { homeTeamId } = team;
    if (!acc[homeTeamId]) {
      acc[homeTeamId] = {
        name, totalGames: 0, totalVictories: 0, totalDraws: 0, goalsFavor: 0, goalsOwn: 0,
      };
    }
    if (team.homeTeamGoals > team.awayTeamGoals) {
      acc[homeTeamId].totalVictories += 1;
    } else if (team.homeTeamGoals === team.awayTeamGoals) {
      acc[homeTeamId].totalDraws += 1;
    }
    acc[homeTeamId].goalsFavor += team.homeTeamGoals;
    acc[homeTeamId].goalsOwn += team.awayTeamGoals;
    acc[homeTeamId].totalGames += 1;
    return acc;
  }, {} as TeamFiltered); return teamsFiltered;
};

export default ReduceLeaderboard;

const removeIndiceReducer = ({ teams, goalsAndGames }: GetMatches) => {
  const allMatches = teams;
  const reducer = goalsAndGames;

  const filterMatches = allMatches.map((match) => {
    const id = match.homeTeamId;
    return reducer[id];
  });
  return filterMatches;
};

const addLostGamesAndPoints = (teams: GoalsAndGames[]) => {
  const reducer = teams;
  const teamsFiltered = reducer.map((team) => {
    const { totalGames, totalVictories, totalDraws, goalsFavor, goalsOwn } = team;
    const totalLosses = totalGames - (totalVictories + totalDraws);
    const totalPoints = (totalVictories * 3) + totalDraws;
    const goalsBalance = goalsFavor - goalsOwn;
    const p = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
    const efficiency = p;
    return {
      ...team,
      totalLosses,
      totalPoints,
      goalsBalance,
      efficiency,
    };
  });
  return teamsFiltered;
};

export {
  removeIndiceReducer,
  addLostGamesAndPoints,
};

export const ReduceLeaderboardAway = (teams: TeamAway[]) => {
  const teamsFiltered = teams.reduce((acc, team) => {
    const { name } = team;
    const { awayTeamId } = team;
    if (!acc[awayTeamId]) {
      acc[awayTeamId] = {
        name, totalGames: 0, totalVictories: 0, totalDraws: 0, goalsFavor: 0, goalsOwn: 0,
      };
    }
    if (team.awayTeamGoals > team.homeTeamGoals) {
      acc[awayTeamId].totalVictories += 1;
    } else if (team.homeTeamGoals === team.awayTeamGoals) {
      acc[awayTeamId].totalDraws += 1;
    }
    acc[awayTeamId].goalsFavor += team.awayTeamGoals;
    acc[awayTeamId].goalsOwn += team.homeTeamGoals;
    acc[awayTeamId].totalGames += 1;
    return acc;
  }, {} as TeamFiltered); return teamsFiltered;
};
export const removeIndiceReducerAway = ({ teams, goalsAndGames }: GetMatches2) => {
  const allMatches = teams;
  const reducer = goalsAndGames;

  const filterMatches = allMatches.map((match) => {
    const id = match.awayTeamId;
    return reducer[id];
  });
  return filterMatches;
};
