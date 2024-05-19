import IMatches from './IMatches';

export interface IMatchesModel {
  findAll(): Promise<IMatches[]>,
  findById(id: number): Promise<IMatches[]>,
  save(match: unknown): Promise<IMatches>,
  createMatch(match: IMatches): Promise<IMatches>,
}
