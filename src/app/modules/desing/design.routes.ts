import { Router } from 'express';
import {
  createDesign,
  deleteDesign,
  getAllDesign,
  getSingleDesign,
  updateDesign,
} from './design.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createDesignSchemaValidation,
  updateDesignSchemaValidation,
} from './desing.validation';
import auth from '../../middlewares/auth';

const designRoutes = Router();

designRoutes.post(
  '/',
  auth('admin', 'superAdmin'),
  validateRequest(createDesignSchemaValidation),
  createDesign
);

designRoutes.get('/get-single-design/:id', getSingleDesign);
designRoutes.get('/', getAllDesign);

designRoutes.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(updateDesignSchemaValidation),
  updateDesign
);

designRoutes.delete('/:id', auth('admin', 'superAdmin'), deleteDesign);

export default designRoutes;
