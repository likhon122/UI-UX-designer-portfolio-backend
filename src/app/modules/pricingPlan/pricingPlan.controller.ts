import catchAsync from '../../utils/catchAsync';
import { successResponse } from '../../utils/response';
import {
  createPricingPlanHandler,
  getAllPricingPlansHandler,
  getSinglePricingPlanHandler,
  updatePricingPlanHandler,
} from './pricingPlan.service';

const createPricingPlan = catchAsync(async (req, res) => {
  const result = await createPricingPlanHandler(req.body);
  return successResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Pricing plan created successfully',
    data: result,
  });
});

const updatePricingPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updatePricingPlanHandler(id, req.body);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Pricing plan updated successfully',
    data: result,
  });
});

const getSinglePricingPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSinglePricingPlanHandler(id);
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Pricing plan fetched successfully',
    data: result,
  });
});

const getAllPricingPlans = catchAsync(async (req, res) => {
  const result = await getAllPricingPlansHandler();
  return successResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Pricing plans fetched successfully',
    data: result,
  });
});

export {
  createPricingPlan,
  updatePricingPlan,
  getSinglePricingPlan,
  getAllPricingPlans,
};
