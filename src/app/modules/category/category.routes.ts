import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from './category.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createCategorySchemaValidation } from './category.validation';
import auth from '../../middlewares/auth';

const categoryRoutes = Router();

categoryRoutes.post(
  '/',
  auth('admin', 'superAdmin'),
  validateRequest(createCategorySchemaValidation),
  createCategory
);

categoryRoutes.get(
  '/get-single-category/:id',
  auth('admin', 'superAdmin'),
  getSingleCategory
);
categoryRoutes.get('/', auth('admin', 'superAdmin'), getAllCategories);
categoryRoutes.patch('/:id', auth('admin', 'superAdmin'), updateCategory);

export default categoryRoutes;
