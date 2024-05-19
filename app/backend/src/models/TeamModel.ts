import TeamModel from '../database/models/TeamsModel';
import { ITeamModel } from '../Interfaces/ITeamModel';
import ITeam from '../Interfaces/ITeam';
// import { NewEntity } from '../Interfaces';

export default class TeamsModel implements ITeamModel {
  private model = TeamModel;

  async findAll(): Promise<ITeam[]> {
    const dbData = await this.model.findAll();

    return dbData.map(({ id, teamName }) => ({ id, teamName }));
  }

  async findById(id: ITeam['id']): Promise<ITeam | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData == null) return null;

    const { teamName }: ITeam = dbData;
    return { id, teamName };
  }
}
