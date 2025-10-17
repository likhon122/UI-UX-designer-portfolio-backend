/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

const createJwtToken = (
  jwtPayload: { userId: Types.ObjectId; role: string },
  jwtSecret: string,
  expiresIn: string
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  const token = jwt.sign(jwtPayload, jwtSecret, options);
  return token;
};

const verifyJwtToken = (token: string, jwtSecret: string) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export { createJwtToken, verifyJwtToken };
