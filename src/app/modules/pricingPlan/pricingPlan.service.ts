import AppError from '../../errors/appError';
import PricingPlan from './pricingPlan.model';
import { TPricingPlan } from './pricingPlan.types';

const createPricingPlanHandler = async (payload: TPricingPlan) => {
  const planAlreadyExists = await PricingPlan.findOne({
    name: payload.name,
  });

  if (planAlreadyExists) {
    throw new AppError(
      409,
      `Pricing plan with name ${payload.name} already exists please update the existing one`
    );
  }

  const plan = await PricingPlan.create(payload);
  if (!plan) {
    throw new AppError(500, 'Failed to create pricing plan. Please try again.');
  }
  return plan;
};

const updatePricingPlanHandler = async (
  id: string,
  payload: Partial<TPricingPlan>
) => {
  const planIsExists = await PricingPlan.findById(id);
  if (!planIsExists) {
    throw new AppError(404, 'Pricing plan not found. Please check the ID.');
  }

  if (payload.name) {
    const nameAlreadyExists = await PricingPlan.findOne({ name: payload.name });
    if (nameAlreadyExists) {
      throw new AppError(
        409,
        `Pricing plan with name ${payload.name} already exists. Please choose a different name.`
      );
    }
  }

  const updatedPlan = await PricingPlan.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!updatedPlan) {
    throw new AppError(500, 'Failed to update pricing plan. Please try again.');
  }
  return updatedPlan;
};

const getSinglePricingPlanHandler = async (id: string) => {
  const plan = await PricingPlan.findById(id);
  if (!plan) {
    throw new AppError(404, 'Pricing plan not found. Please check the ID.');
  }
  return plan;
};
const getAllPricingPlansHandler = async () => {
  const plans = await PricingPlan.find();
  return plans;
};

export {
  createPricingPlanHandler,
  updatePricingPlanHandler,
  getSinglePricingPlanHandler,
  getAllPricingPlansHandler,
};
