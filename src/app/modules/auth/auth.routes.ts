import { NextFunction, Request, Response, Router } from 'express';
import {
  changePassword,
  forgetPassword,
  getAccessToken,
  login,
  logout,
  registerUser,
  resetPassword,
  signUp,
} from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  changePasswordSchemaValidation,
  forgotPasswordSchemaValidation,
  loginSchemaValidation,
  registerUserSchemaValidation,
  resetPasswordSchemaValidation,
  signUpSchemaValidation,
} from './auth.vlidation';
import isAlreadyLoggedIn from '../../middlewares/isAlreadyLoggedIn';
import alreadyLoggedOut from '../../middlewares/alreadyLoggedOut';
import auth from '../../middlewares/auth';

const authRoutes = Router();

authRoutes.post(
  '/login',
  (req: Request, res: Response, next: NextFunction) => {
    isAlreadyLoggedIn(req, res, next);
  },
  validateRequest(loginSchemaValidation),
  login
);
authRoutes.post(
  '/sign-up',
  (req: Request, res: Response, next: NextFunction) => {
    isAlreadyLoggedIn(req, res, next);
  },
  validateRequest(signUpSchemaValidation),
  signUp
);
authRoutes.post(
  '/register-user',
  (req: Request, res: Response, next: NextFunction) => {
    isAlreadyLoggedIn(req, res, next);
  },
  validateRequest(registerUserSchemaValidation),
  registerUser
);

authRoutes.post(
  '/forget-password',
  (req: Request, res: Response, next: NextFunction) => {
    isAlreadyLoggedIn(req, res, next);
  },
  validateRequest(forgotPasswordSchemaValidation),
  forgetPassword
);

authRoutes.post(
  '/reset-password',
  (req: Request, res: Response, next: NextFunction) => {
    isAlreadyLoggedIn(req, res, next);
  },
  validateRequest(resetPasswordSchemaValidation),
  resetPassword
);

authRoutes.patch(
  '/change-password',
  auth('admin', 'customer'),
  validateRequest(changePasswordSchemaValidation),
  changePassword
);

authRoutes.get(
  '/access-token',
  (req: Request, res: Response, next: NextFunction) => {
    alreadyLoggedOut(req, res, next);
  },
  getAccessToken
);

authRoutes.post(
  '/logout',
  (req: Request, res: Response, next: NextFunction) => {
    alreadyLoggedOut(req, res, next);
  },
  auth('admin', 'customer', 'superAdmin'),
  logout
);

export default authRoutes;
