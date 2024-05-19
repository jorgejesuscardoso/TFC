import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import IUser from '../Interfaces/IUser';

export const SECRET = 'jwt_secret';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) { }

  public async Login(req: Request, res: Response) {
    const { password, email } = req.body;
    const user = await this.userService.findByEmail(email, password);
    const idString = user.data.id && user.data.id.toString();
    const status = mapStatusHTTP(user.status);

    if (idString) {
      const token = jwt.sign(idString, SECRET, { algorithm: 'HS256' });
      return res.status(status).json({ token });
    }
    return res.status(status).json({ message: user.data });
  }

  public async FindRoleByUserId(req: Request, res: Response) {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    const id = token && jwt.verify(token, SECRET);
    const user = id && await this.userService.findById(+id) as unknown as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const hasRole = user.data && user.data.role;
    return res.status(200).json({ role: hasRole });
  }
}
