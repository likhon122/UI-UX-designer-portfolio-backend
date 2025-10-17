import httpStatus from 'http-status';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import { verifyJwtToken } from '../utils/jwt';
import { ENV } from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import { UserRole } from '../modules/user/user.types';

const auth = (...roles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    // If no access token is found in cookies, user is not logged in
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are Unauthorized!');
    }

    // If access token is found, proceed to the next middleware/controller and set req.user

    const decoded = verifyJwtToken(token, ENV.jwtSecret) as JwtPayload;

    if (!decoded) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Invalid token or user does not exist'
      );
    }

    if (roles.length && !roles.includes(decoded.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have permission to perform this action'
      );
    }

    // Check if user still exists
    const userExist = await User.findById(decoded.userId);
    if (!userExist) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User no longer exist');
    }

    // check user is not deleted
    if (userExist.isDeleted) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User is already deleted');
    } else if (userExist.status === 'blocked') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User is not blocked');
    }

    // Add user info to req object
    req.user = decoded;
    next();
  });
};

export default auth;
