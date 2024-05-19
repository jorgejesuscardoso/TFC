import {
  Request,
  Response,
  NextFunction,
} from 'express';
import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/UserModel';
import {
  emailOrPasswordInvalid, invalidData, invalidToken, tokenNotFound,
} from '../utils/MessageResponse';
import getToken from '../utils/jwt';

const ValidateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) return { message: invalidData, status: 400 };

  if (!emailRegex.test(email)) return { message: emailOrPasswordInvalid, status: 'UNAUTHORIZED' };

  return { isValid: true };
};

const ValidatePassword = (password: string) => {
  if (!password) {
    return { message: invalidData, status: 400 };
  }
  if (password.length < 6) {
    return { message: emailOrPasswordInvalid, status: 'UNAUTHORIZED' };
  }
  return { isValid: true };
};

const ValidateCredentials = async (email: string, password: string) => {
  const hasEmail = await UserModel.findOne({ where: { email } });

  if (!hasEmail) return { message: emailOrPasswordInvalid, status: 401 };

  const user = hasEmail.dataValues;
  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) return { message: emailOrPasswordInvalid, status: 401 };
};

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const emailValidation = ValidateEmail(email);
  const passwordValidation = ValidatePassword(password);
  const emailStatus = emailValidation.status ? emailValidation.status as number : 401;
  const passwordStatus = passwordValidation.status ? passwordValidation.status as number : 401;
  const status = emailStatus === 400 || passwordStatus === 400 ? 400 : 401;
  if (!emailValidation.isValid) {
    return res.status(status).json({ message: emailValidation.message });
  } if (!passwordValidation.isValid) {
    return res.status(status).json({ message: passwordValidation.message });
  }
  const credentialsValidation = await ValidateCredentials(email, password);
  if (credentialsValidation) {
    return res.status(credentialsValidation.status)
      .json({ message: credentialsValidation.message });
  }
  next();
};

const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: tokenNotFound });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: invalidToken });
  }

  const valid = getToken(token);

  if (!valid) {
    return res.status(401).json({ message: invalidToken });
  }
  next();
};

export {
  ValidateEmail,
  ValidatePassword,
  validateLogin,
  TokenValidation,
};
