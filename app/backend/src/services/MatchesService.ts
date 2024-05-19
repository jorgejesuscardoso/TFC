import IMatches from '../Interfaces/IMatches';
import { IMatchesModel } from '../Interfaces/IMatchesModel';
import MatchesModels from '../models/MatchesModel';

export default class MatchesService {
  constructor(
    private matchesModel: IMatchesModel = new MatchesModels(),
  ) { }

  public async findAllMatches() {
    try {
      const allMatches = await this.matchesModel.findAll() as unknown[];
      return allMatches || [];
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Error fetching matches', id: '' },
      };
    }
  }

  public async findMatchById(id: number) {
    try {
      const [match] = await this.matchesModel.findById(id);
      return match;
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Error fetching match', id: '' },
      };
    }
  }

  public async save(match: unknown) {
    try {
      const newMatch = await this.matchesModel.save(match);
      return newMatch;
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Error saving match', id: '' },
      };
    }
  }

  public async createMatch(match: IMatches) {
    try {
      const newMatch = await this.matchesModel.createMatch(match);
      return newMatch;
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: 'Error creating match', id: '' },
      };
    }
  }
}
