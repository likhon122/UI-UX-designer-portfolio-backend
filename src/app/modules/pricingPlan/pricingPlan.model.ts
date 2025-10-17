import mongoose, { Schema } from 'mongoose';
import { TPricingPlan } from './pricingPlan.types';

const PricingPlanSchema = new Schema<TPricingPlan>(
  {
    name: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium'],
      unique: true,
      required: true,
    },
    price: { type: Number, required: true },
    features: [String],
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PricingPlan = mongoose.model<TPricingPlan>(
  'pricing-plan',
  PricingPlanSchema
);

export default PricingPlan;
