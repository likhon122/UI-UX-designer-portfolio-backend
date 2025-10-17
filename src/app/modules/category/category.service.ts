import httpStatus from 'http-status';

import AppError from '../../errors/appError';

import Category from './category.model';
import { TCategory } from './category.types';

const createCategoryHandler = async (payload: TCategory) => {
  const categoryExist = await Category.findOne({
    name: payload.name,
  });

  if (categoryExist) {
    throw new AppError(httpStatus.CONFLICT, 'Category already exists');
  }

  const category = await Category.create(payload);
  return category;
};

const getSingleCategoryHandler = async (id: string) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category id is required');
  }
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const getAllCategoriesHandler = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  return categories;
};

const updateCategoryHandler = async (
  payload: Partial<TCategory>,
  id: string
) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category id is required');
  }
  const category = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

export {
  createCategoryHandler,
  getSingleCategoryHandler,
  updateCategoryHandler,
  getAllCategoriesHandler,
};
