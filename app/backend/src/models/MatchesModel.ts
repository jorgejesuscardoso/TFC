import MatchModel from '../database/models/Matches';
import { IMatchesModel } from '../Interfaces/IMatchesModel';
import IMatch from '../Interfaces/IMatches';

export default class MatchesModels implements IMatchesModel {
  private model = MatchModel;

  async findAll(): Promise<IMatch[]> {
    const data = await this.model.findAll();
    return data.map(({
      id,
      awayTeamGoals,
      awayTeamId,
      homeTeamGoals,
      homeTeamId,
      inProgress }) => ({ id, awayTeamGoals, awayTeamId, homeTeamGoals, homeTeamId, inProgress }));
  }

  async findById(id: number): Promise<IMatch[]> {
    const data = await this.model.findByPk(id);
    return data ? [data] : [];
  }

  async save(match: IMatch): Promise<IMatch> {
    const data = await this.model.update(match, { where: { id: match.id } });
    return data ? match : {
      id: 0, awayTeamGoals: 0, awayTeamId: 0, homeTeamGoals: 0, homeTeamId: 0, inProgress: false };
  }

  async createMatch(match: IMatch): Promise<IMatch> {
    const data = await this.model.create(match);
    return data;
  }
}
