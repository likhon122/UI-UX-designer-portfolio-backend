import { Router } from 'express';
import {
  createPricingPlan,
  getAllPricingPlans,
  getSinglePricingPlan,
  updatePricingPlan,
} from './pricingPlan.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
  pricingPlanSchemaValidation,
  updatePricingPlanSchemaValidation,
} from './pricingPlan.validation';

const pricingPlanRoutes = Router();

pricingPlanRoutes.post(
  '/',
  auth('admin', 'superAdmin'),
  validateRequest(pricingPlanSchemaValidation),
  createPricingPlan
);

pricingPlanRoutes.patch(
  '/:id',
  auth('admin', 'superAdmin'),
  validateRequest(updatePricingPlanSchemaValidation),
  updatePricingPlan
);

pricingPlanRoutes.get('/:id', getSinglePricingPlan);
pricingPlanRoutes.get('/', getAllPricingPlans);

export default pricingPlanRoutes;
