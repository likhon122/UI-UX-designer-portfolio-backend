import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  createDesignHandler,
  deleteDesignHandler,
  getAllDesignsHandler,
  getSingleDesignHandler,
  updateDesignHandler,
} from './design.service';

const createDesign = catchAsync(async (req, res) => {
  const result = await createDesignHandler(req.body);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Design created successfully',
    data: result,
  });
});

const getSingleDesign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleDesignHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Design fetched successfully',
    data: result,
  });
});

const getAllDesign = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getAllDesignsHandler(page, limit);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Designs fetched successfully',
    data: result,
  });
});

const updateDesign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateDesignHandler(req.body, id);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Design updated successfully',
    data: result,
  });
});

const deleteDesign = catchAsync(async (req, res) => {
  const { id } = req.params;
  await deleteDesignHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Design with id ${id} deleted successfully`,
    data: {},
  });
});

export {
  createDesign,
  getSingleDesign,
  getAllDesign,
  updateDesign,
  deleteDesign,
};
