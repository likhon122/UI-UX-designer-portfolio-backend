import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TSignUp } from './auth.types';
import { Customer } from '../customer/customer.model';
import { comparePassword } from '../../utils/password';

import { ENV } from '../../config';
import { Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendEmail from '../../utils/sendEmail';
import { createJwtToken, verifyJwtToken } from '../../utils/jwt';
import mongoose from 'mongoose';

const loginHandler = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordMatched = await comparePassword(password, user?.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const userWithoutPassword = { ...user.toObject(), password: undefined };
  // Create Access Token and Refresh Token
  const tokenInfo = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = createJwtToken(
    tokenInfo,
    ENV.jwtSecret,
    ENV.accessTokenExpiresIn
  );
  const refreshToken = createJwtToken(
    tokenInfo,
    ENV.jwtSecret,
    ENV.refreshTokenExpiresIn
  );

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const signUpHandler = async (payload: TSignUp) => {
  const userExists = await User.findOne({
    email: payload.email,
  });

  if (payload.phone) {
    const customerExists = await Customer.findOne({
      phone: payload.phone,
    });
    if (customerExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Customer is already registered with this phone number.'
      );
    }
  }

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User is already registered with this email.'
    );
  }
  // Create Jwt token for sending email verification link
  const token = jwt.sign({ ...payload }, ENV.jwtSecret, { expiresIn: '5m' });
  // Send verification email
  const verificationLink = `${ENV.clientUrl}/email-verify?token=${token}`;
  const emailData = {
    to: payload.email,
    subject: 'Email Verification',
    message:
      'Please click the link below to verify your email address:\n' +
      verificationLink,
    html: `
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  };
  await sendEmail(emailData);
  return { token };
};

const registerUserHandler = async (payload: { token: string }) => {
  if (!payload.token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid token or token expired.'
    );
  }

  const decodedToken = verifyJwtToken(payload.token, ENV.jwtSecret);

  if (!decodedToken || typeof decodedToken === 'string') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid token or token expired.'
    );
  }

  const signUpData = decodedToken as TSignUp;

  const userData = {
    email: signUpData.email,
    password: signUpData.password,
    role: 'customer',
  };

  // Make session for Transaction
  const session = await mongoose.startSession();

  try {
    // Start Transaction
    session.startTransaction();
    const user = new User({
      ...userData,
    });

    await user.save({ session });

    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }

    // Crate customer profile
    const customerProfile = {
      user: user._id,
      name: signUpData.name,
      phone: signUpData?.phone,
      address: signUpData?.address,
      profileImage: signUpData?.profileImage,
    };

    const customer = new Customer(customerProfile);
    await customer.save({ session });

    if (!customer) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create customer profile.'
      );
    }

    const jwtPayload = {
      userId: user._id,
      role: user.role,
    };

    // Now automatically logged in the user.
    const accessToken = createJwtToken(
      jwtPayload,
      ENV.jwtSecret,
      ENV.accessTokenExpiresIn
    );
    const refreshToken = createJwtToken(
      jwtPayload,
      ENV.jwtSecret,
      ENV.refreshTokenExpiresIn
    );

    const userWithoutPassword = { ...user.toObject(), password: undefined };
    // Transaction is successful and commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return { user: userWithoutPassword, customer, accessToken, refreshToken };
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const forgetPasswordHandler = async (payload: { email: string }) => {
  const { email } = payload;
  const userExists = await User.findOne({
    email: email,
  });
  if (!userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No user found with this email.'
    );
  }
  // Create Jwt token for sending email verification link
  const token = jwt.sign({ email }, ENV.jwtSecret, { expiresIn: '5m' });
  // Send verification email
  const resetPasswordLink = `${ENV.clientUrl}/reset-password?token=${token}`;
  const emailData = {
    to: email,
    subject: 'Password Reset',
    message:
      'Please click the link below to reset your password:\n' +
      resetPasswordLink,
    html: `
      <p>Please click the link below to reset your password:</p>
      <a href="${resetPasswordLink}">Reset Password</a>
    `,
  };
  await sendEmail(emailData);
  return token;
};

const resetPasswordHandler = async (
  payload: { changedPassword: string },
  token: string | undefined
) => {
  // Verify token

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No token found');
  }

  const decodedToken = verifyJwtToken(token, ENV.jwtSecret);
  if (!decodedToken || typeof decodedToken === 'string') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid token or token expired.'
    );
  }
  const { email } = decodedToken as { email: string };
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No user found with this email.'
    );
  }

  user.password = payload.changedPassword;
  await user.save();
  return true;
};

const changePasswordHandler = async (
  payload: { currentPassword: string; newPassword: string },
  userId: string
) => {
  const existingUser = await User.findById(userId).select('+password');
  if (!existingUser || !existingUser.password) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isPasswordMatched = await comparePassword(
    payload.currentPassword,
    existingUser.password
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Current password is incorrect. Please enter the correct password.'
    );
  }

  existingUser.password = payload.newPassword;
  await existingUser.save();
  return true;
};

const getAccessTokenHandler = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'No refresh token found');
  }

  const decoded = verifyJwtToken(refreshToken, ENV.jwtSecret);
  if (!decoded || typeof decoded === 'string') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to get access token'
    );
  }
  const { userId } = decoded as JwtPayload;
  const user = await User.findById(userId).select('_id role');
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to get access token'
    );
  }

  if (user.isDeleted) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your account has been deleted. Please contact support.'
    );
  }
  if (user.status === 'blocked') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your account has been blocked. Please contact support.'
    );
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };
  const accessToken = createJwtToken(
    jwtPayload,
    ENV.jwtSecret,
    ENV.accessTokenExpiresIn
  );
  return accessToken;
};

const logOutHandler = (cookies: { [key: string]: string }, res: Response) => {
  const { refreshToken } = cookies;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No refresh token found');
  }
  res.cookie('refreshToken', '', {
    secure: ENV.envMode === 'production', // Set to true in production
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(0), // Expire the cookie immediately
  });
  return true;
};

export {
  loginHandler,
  signUpHandler,
  registerUserHandler,
  forgetPasswordHandler,
  resetPasswordHandler,
  changePasswordHandler,
  getAccessTokenHandler,
  logOutHandler,
};
