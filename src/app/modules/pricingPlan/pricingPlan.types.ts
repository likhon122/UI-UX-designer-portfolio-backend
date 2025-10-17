export type TPricingPlanName = 'Basic' | 'Standard' | 'Premium';

export type TPricingPlan = {
  name: TPricingPlanName;
  price: number;
  features: string[];
  duration: number;
};
