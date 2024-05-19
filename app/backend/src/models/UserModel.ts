import UserModel from '../database/models/UserModel';
import { IUserModel } from '../Interfaces/IUserModel';
import IUser from '../Interfaces/IUser';

export default class UsersModel implements IUserModel {
  private model = UserModel;

  async findByEmail(email: string): Promise<IUser | null> {
    const dbData = await this.model.findOne({ where: { email } });
    if (dbData == null) return null;

    const { id, password, username, role }: IUser = dbData;
    return { id, email, password, username, role };
  }

  async findById(id: number): Promise<IUser | null> {
    const dbData = await this.model.findByPk(id);

    if (dbData == null) return null;

    const { email, password, username, role }: IUser = dbData;
    return { id, email, password, username, role };
  }
}
