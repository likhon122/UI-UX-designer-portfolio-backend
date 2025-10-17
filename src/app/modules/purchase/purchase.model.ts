import mongoose, { Schema } from 'mongoose';
import { TPurchase } from './purchase.types';

const PurchaseSchema = new Schema<TPurchase>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    design: { type: Schema.Types.ObjectId, ref: 'design', required: true },
    pricingPlan: {
      type: Schema.Types.ObjectId,
      ref: 'pricing-plan',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Cancelled'],
      default: 'Pending',
    },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Purchase = mongoose.model<TPurchase>('purchase', PurchaseSchema);
export default Purchase;
