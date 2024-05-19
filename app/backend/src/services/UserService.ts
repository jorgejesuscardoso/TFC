import * as bcrypt from 'bcryptjs';
import IUser from '../Interfaces/IUser';
import { IUserModel } from '../Interfaces/IUserModel';
import UserModel from '../models/UserModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import { invalidData, userNotFound } from '../utils/MessageResponse';

export default class UserService {
  constructor(
    private userModel: IUserModel = new UserModel(),
  ) { }

  public async findByEmail(email: string, password: string): Promise<ServiceResponse<IUser>> {
    try {
      const user = await this.userModel.findByEmail(email);
      if (!user) return { status: 'NOT_FOUND', data: { message: userNotFound, id: '' } };

      if (user.password) {
        const compare = await bcrypt.compareSync(password, user.password);
        if (!compare) return { status: 'UNAUTHORIZED', data: { message: invalidData, id: '' } };
      }
      return { status: 'SUCCESSFUL', data: user };
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: userNotFound, id: '' },
      };
    }
  }

  public async findById(id: number): Promise<ServiceResponse<IUser>> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) return { status: 'NOT_FOUND', data: { message: userNotFound, id: '' } };
      return { status: 'SUCCESSFUL', data: user };
    } catch (error) {
      return {
        status: 'INTERNAL_ERROR',
        data: { message: userNotFound, id: '' },
      };
    }
  }
}
