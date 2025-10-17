import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  createCategoryHandler,
  getAllCategoriesHandler,
  getSingleCategoryHandler,
  updateCategoryHandler,
} from './category.service';

const createCategory = catchAsync(async (req, res) => {
  const result = await createCategoryHandler(req.body);

  return successResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleCategoryHandler(id);

  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await getAllCategoriesHandler(page, limit);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateCategoryHandler(req.body, id);
  return successResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: result,
  });
});

export { createCategory, getSingleCategory, updateCategory, getAllCategories };
