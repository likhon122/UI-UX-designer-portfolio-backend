import httpStatus from 'http-status';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import { ENV } from '../config';
import { verifyJwtToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

const alreadyLoggedOut = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are logged out please login first!'
    );
  }
  const decoded = verifyJwtToken(refreshToken, ENV.jwtSecret);
  if (!decoded) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are logged out please login first!'
    );
  }

  req.user = decoded as JwtPayload;

  next();
});
export default alreadyLoggedOut;
