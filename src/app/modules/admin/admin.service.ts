import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { Admin } from './admin.model';
import { TAdmin, TCreateAdmin } from './admin.types';
import mongoose from 'mongoose';

const createAdminHandler = async (payload: TCreateAdmin) => {
  const existingAdmin = await User.findOne({
    email: payload.email,
    role: 'admin',
  });

  if (existingAdmin) {
    throw new AppError(400, 'An admin with this email already exists.');
  }

  if (payload.phone) {
    const adminExist = await Admin.findOne({
      phone: payload.phone,
    });
    console.log(adminExist);
    if (adminExist) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Admin is already registered with this phone number.'
      );
    }
  }

  // Make a session of Transaction
  const session = await mongoose.startSession();

  try {
    // Start Transaction
    session.startTransaction();
    const userInfo = {
      email: payload.email,
      password: payload.password,
      role: 'admin',
    };

    const user = new User(userInfo);
    await user.save({ session });
    if (!user) {
      throw new AppError(
        500,
        'Failed to create user for admin. Please try again.'
      );
    }

    const adminInfo: Partial<TAdmin> = {
      ...payload,
      user: user._id,
      position: payload.position || 'Administrator',
    };

    const admin = new Admin(adminInfo);
    await admin.save({ session });
    if (!admin) {
      throw new AppError(500, 'Failed to create admin. Please try again.');
    }

    // Transaction is successful and commit the transaction
    await session.commitTransaction();
    await session.endSession();
    const userWithoutPassword = { ...user.toObject(), password: undefined };
    return {
      user: userWithoutPassword,
      admin,
    };
  } catch (error) {
    // Rollback the transaction
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getAllAdminsHandler = async (query: {
  page?: number;
  limit?: number;
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const admins = await Admin.find()
    .skip(skip)
    .limit(limit)
    .populate('user', 'email role');
  return admins;
};

const updateAdminHandler = async (
  id: string,
  payload: {
    position?: 'Administrator' | 'Manager';
  }
) => {
  const admin = await Admin.findByIdAndUpdate(
    id,
    {
      position: payload.position,
    },
    { new: true }
  );
  if (!admin) {
    throw new AppError(404, 'Admin not found. Please check the ID.');
  }
  return admin;
};

const getSingleAdminHandler = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Admin ID is required to fetch a single admin.');
  }

  const admin = await Admin.findById(id).populate('user', 'email role');
  if (!admin) {
    throw new AppError(404, 'Admin not found. Please check the ID.');
  }
  return admin;
};

export {
  createAdminHandler,
  getAllAdminsHandler,
  updateAdminHandler,
  getSingleAdminHandler,
};
