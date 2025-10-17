export type UserRole = 'admin' | 'customer' | 'superAdmin';
export type TUserStatus = 'active' | 'blocked';

export type TUser = {
  email: string;
  password: string;
  role: UserRole;
  isDeleted: boolean;
  status: TUserStatus;
  createdAt: Date;
  updatedAt: Date;
};
