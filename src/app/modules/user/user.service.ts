import { Types } from 'mongoose';
import AppError from '../../errors/appError';
import { User } from './user.model';
import { UserRole } from './user.types';
import { TCustomer } from '../customer/customer,types';
import { Customer } from '../customer/customer.model';
import { Admin } from '../admin/admin.model';

const getMeHandler = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found. Please check the ID.');
  }

  if (user.role === 'customer') {
    const customer = await Customer.findOne({ user: user._id });
    return {
      user,
      customer,
    };
  }
  if (user.role === 'admin') {
    const admin = await Admin.findOne({ user: user._id });
    return {
      user,
      admin,
    };
  }

  if (user.role === 'superAdmin') {
    return {
      user,
    };
  }
  throw new AppError(400, 'Invalid user role.');
};

const getSingleUserHandler = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'User ID is required to fetch a single user.');
  }
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new AppError(404, 'User not found. Please check the ID.');
  }
  return user;
};

const getAllUsersHandler = async (
  query: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    isDeleted?: boolean;
  } = {}
) => {
  const filter: Record<string, unknown> = {};

  if (query.role) {
    filter['role'] = query.role;
  }
  if (query.status) {
    filter['status'] = query.status;
  }
  if (query.isDeleted !== undefined) {
    filter['isDeleted'] = query.isDeleted;
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .select('-password');
  return users;
};

const updateUserHandler = async (
  userId: string,
  role: UserRole,
  payload: Partial<TCustomer>
) => {
  const updatedData: Record<string, unknown> = {};

  if (payload.name) {
    updatedData['name'] = payload.name;
  }
  if (payload.phone) {
    updatedData['phone'] = payload.phone;
  }
  if (payload.address) {
    updatedData['address'] = payload.address;
  }
  if (payload.profileImage) {
    updatedData['profileImage'] = payload.profileImage;
  }

  if (role === 'customer') {
    if (updatedData['phone']) {
      const phoneExists = await Customer.findOne({
        phone: updatedData['phone'],
      })
        .select('_id user')
        .lean();

      if (phoneExists && phoneExists?.user.toString() !== userId) {
        throw new AppError(
          400,
          'Phone number already exists. Please use another one.'
        );
      }
    }

    const customer = await Customer.findOneAndUpdate(
      { user: userId },
      updatedData,
      { new: true }
    );
    if (!customer) {
      throw new AppError(404, 'Customer profile not found for this user.');
    }
    return customer;
  }
  if (role === 'admin') {
    if (updatedData['phone']) {
      const phoneExists = await Admin.findOne({
        phone: updatedData['phone'],
      });
      if (phoneExists) {
        throw new AppError(
          400,
          'Phone number already exists. Please use another one.'
        );
      }
    }

    const admin = await Admin.findOneAndUpdate({ user: userId }, updatedData, {
      new: true,
    });
    if (!admin) {
      throw new AppError(404, 'Admin profile not found for this user.');
    }
    return admin;
  }
  throw new AppError(
    400,
    'Only customers and admins can update their profile.'
  );
};

export {
  getMeHandler,
  getSingleUserHandler,
  getAllUsersHandler,
  updateUserHandler,
};
