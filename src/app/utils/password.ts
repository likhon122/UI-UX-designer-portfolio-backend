import bcrypt from 'bcryptjs';

export const hashPassword = async (
  password: string,
  saltRounds = Number(process.env.BCRYPT_SALT || 10)
) => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
