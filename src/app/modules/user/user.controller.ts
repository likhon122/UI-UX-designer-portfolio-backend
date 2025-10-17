import httpStatus from 'http-status';
import { successResponse } from '../../utils/response';
import catchAsync from '../../utils/catchAsync';
import {
  getAllUsersHandler,
  getMeHandler,
  getSingleUserHandler,
  updateUserHandler,
} from './user.service';

const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await getMeHandler(userId);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleUserHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User fetched successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await getAllUsersHandler(req.query);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users fetched successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const role = req.user.role;
  const result = await updateUserHandler(userId, role, req.body);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
});

export { getMe, getSingleUser, getAllUsers, updateUser };
