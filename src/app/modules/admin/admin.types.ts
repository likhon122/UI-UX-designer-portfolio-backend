import { Types } from 'mongoose';
import { TUser } from '../user/user.types';

export type TCreateAdmin = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  position?: 'Administrator' | 'Manager';
  profileImage?: string;
};

export type TAdmin = {
  name: string;
  user: Types.ObjectId | TUser;
  phone?: string;
  address?: string;
  position?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
};
