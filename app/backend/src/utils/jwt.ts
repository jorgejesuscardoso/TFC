import * as jwt from 'jsonwebtoken';
import { SECRET } from '../controller/UserController';

const getToken = (token: string) => {
  try {
    const valid = jwt.verify(token, SECRET);
    return valid;
  } catch (error) {
    return false;
  }
};

export default getToken;
