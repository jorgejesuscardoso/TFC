import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) { }

  public async getAllTeams(_req: Request, res: Response): Promise<void> {
    const teams = await this.teamService.getAllTeams();
    const status = mapStatusHTTP(teams.status);
    res.status(status).json(teams.data);
  }

  public async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.teamService.getTeamById(Number(id));

    const status = mapStatusHTTP(team.status);
    if (team.status !== 'SUCCESSFUL') {
      return res.status(status).json(team.data);
    }
    res.status(status).json(team.data);
  }
}
