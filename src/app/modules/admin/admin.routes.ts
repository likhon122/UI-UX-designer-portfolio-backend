import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
  createAdminSchemaValidation,
  updateAdminSchemaValidation,
} from './admin.validation';
import {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
} from './admin.controller';

const adminRoutes = Router();

adminRoutes.post(
  '/create-admin',
  auth('superAdmin'),
  validateRequest(createAdminSchemaValidation),
  createAdmin
);

adminRoutes.patch(
  '/change-admin-position/:id',
  auth('superAdmin'),
  validateRequest(updateAdminSchemaValidation),
  updateAdmin
);

adminRoutes.get('/', auth('admin', 'superAdmin'), getAllAdmins);
adminRoutes.get('/:id', auth('admin', 'superAdmin'), getSingleAdmin);

export default adminRoutes;
