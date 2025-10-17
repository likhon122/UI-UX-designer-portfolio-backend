import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const mongoDBUrl =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/designerPortfolio';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || '';
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const envMode = process.env.NODE_ENV || 'development';
const mailEmail = process.env.MAIL_EMAIL || '';
const mailPassword = process.env.MAIL_PASSWORD || '';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';

export const ENV = {
  port,
  mongoDBUrl,
  jwtSecret,
  superAdminPassword,
  superAdminEmail,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  envMode,
  mailEmail,
  mailPassword,
  clientUrl,
};
