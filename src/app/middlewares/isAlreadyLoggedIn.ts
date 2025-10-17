import httpStatus from 'http-status';
import AppError from '../errors/appError';
import catchAsync from '../utils/catchAsync';
import { verifyJwtToken } from '../utils/jwt';
import { ENV } from '../config';

const isAlreadyLoggedIn = catchAsync(async (req, res, next) => {
  // Check the cookie for the refresh token
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const decoded = verifyJwtToken(refreshToken, ENV.jwtSecret);

    if (decoded) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You are already logged in. Please log out to access this resource.'
      );
    }
  }
  next();
});

export default isAlreadyLoggedIn;
