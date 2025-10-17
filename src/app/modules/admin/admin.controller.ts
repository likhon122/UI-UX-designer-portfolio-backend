import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  createAdminHandler,
  getAllAdminsHandler,
  getSingleAdminHandler,
  updateAdminHandler,
} from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
  const result = await createAdminHandler(req.body);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Admin created successfully',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await getAllAdminsHandler(req.query);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admins fetched successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateAdminHandler(id, req.body);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin updated successfully',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleAdminHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admins fetched successfully',
    data: result,
  });
});

export { createAdmin, getAllAdmins, updateAdmin, getSingleAdmin };
