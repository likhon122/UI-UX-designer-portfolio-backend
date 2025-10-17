import { Router } from 'express';
import {
  createPurchase,
  getAllMyPurchase,
  getAllPurchases,
  getRevenue,
  getSinglePurchase,
  updatePurchase,
} from './purchase.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
  createPurchaseSchemaValidation,
  updatePurchaseSchemaValidation,
} from './purchase.validation';

const purchaseRoutes = Router();
purchaseRoutes.post(
  '/',
  auth('customer'),
  validateRequest(createPurchaseSchemaValidation),
  createPurchase
);

purchaseRoutes.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(updatePurchaseSchemaValidation),
  updatePurchase
);

purchaseRoutes.get('/get-all-my-purchase', auth('customer'), getAllMyPurchase);
purchaseRoutes.get('/', auth('admin', 'superAdmin'), getAllPurchases);
purchaseRoutes.get('/get-revenue', auth('admin', 'superAdmin'), getRevenue);
purchaseRoutes.get(
  '/:id',
  auth('admin', 'customer', 'superAdmin'),
  getSinglePurchase
);

export default purchaseRoutes;
