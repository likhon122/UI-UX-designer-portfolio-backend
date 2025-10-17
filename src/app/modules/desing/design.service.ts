import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import Category from '../category/category.model';
import { TDesign } from './design.types';
import Design from './design.model';

const createDesignHandler = async (payload: TDesign) => {
  const categoryExists = await Category.findById(payload.category);

  if (!categoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid category ID');
  }

  const design = (await Design.create(payload)).populate('category');
  if (!design) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create design. Please try again.'
    );
  }
  return design;
};

const getSingleDesignHandler = async (id: string) => {
  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Design id is required in params'
    );
  }
  const design = await Design.findById(id).populate('category');
  if (!design) {
    throw new AppError(httpStatus.NOT_FOUND, 'Design not found');
  }
  return design;
};

const getAllDesignsHandler = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const designs = await Design.find()
    .skip(skip)
    .limit(limit)
    .populate('category');
  return designs;
};

const updateDesignHandler = async (payload: Partial<TDesign>, id: string) => {
  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Design id is required for update'
    );
  }

  if (payload.category) {
    const categoryExists = await Category.findById(payload.category);
    if (!categoryExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid category ID');
    }
  }

  const design = await Design.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('category');
  if (!design) {
    throw new AppError(httpStatus.NOT_FOUND, 'Design not found');
  }
  return design;
};

const deleteDesignHandler = async (id: string) => {
  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Design id is required for delete'
    );
  }

  const designExists = await Design.findById(id);
  if (!designExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Design not found');
  }
  if (designExists.status === 'Archived') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Design is already archived/deleted');
  }
  // Soft delete: set isDeleted to true
  const design = await Design.findByIdAndUpdate(id, { status: 'Archived' });
  if (!design) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong! Please try again.'
    );
  }
  return design;
};

export {
  createDesignHandler,
  getSingleDesignHandler,
  getAllDesignsHandler,
  updateDesignHandler,
  deleteDesignHandler,
};
