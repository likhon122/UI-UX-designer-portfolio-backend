import { ENV } from '.';
import { userRole } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superAdmin = {
  email: ENV.superAdminEmail,
  password: ENV.superAdminPassword,
  needsPasswordChange: false,
  role: userRole.SUPER_ADMIN,
  status: 'active',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const existingUser = await User.findOne({
    email: superAdmin.email,
    role: superAdmin.role,
  });
  if (!existingUser) {
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
