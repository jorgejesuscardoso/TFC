import { LeaderboardHome } from '../Interfaces/Leaderboard';

const FilterRepeated = (arr: LeaderboardHome[]) => {
  const uniqueArray = arr.filter((obj, index, self) => {
    const indexOfFirstOccurrence = self.findIndex((item) => item.name === obj.name);
    return indexOfFirstOccurrence === index;
  });
  return uniqueArray;
};

export default FilterRepeated;

export const OrdenatedLeaderboard = (arr: LeaderboardHome[]) => {
  const orderedArray = arr.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (a.totalVictories !== b.totalVictories) {
      return b.totalVictories - a.totalVictories;
    }
    if (a.goalsBalance !== b.goalsBalance) {
      return b.goalsBalance - a.goalsBalance;
    }
    return b.goalsFavor - a.goalsFavor;
  });
  return orderedArray;
};
