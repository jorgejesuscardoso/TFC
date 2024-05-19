// import { NewEntity } from '../Interfaces';
import ITeam from '../Interfaces/ITeam';
import { ITeamModel } from '../Interfaces/ITeamModel';
import TeamModel from '../models/TeamModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { errorFetchingTeams, teamNotFound } from '../utils/MessageResponse';

export default class TeamService {
  constructor(
    private teamModel: ITeamModel = new TeamModel(),
  ) { }

  public async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    try {
      const allTeams = await this.teamModel.findAll();
      return {
        status: 'SUCCESSFUL',
        data: allTeams,
      };
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: errorFetchingTeams, id: '' },
      };
    }
  }

  public async getTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    try {
      const team = await this.teamModel.findById(id);
      if (!team) return { status: 'NOT_FOUND', data: { message: teamNotFound, id: '' } };

      return { status: 'SUCCESSFUL', data: team };
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: errorFetchingTeams, id: '' },
      };
    }
  }
}
