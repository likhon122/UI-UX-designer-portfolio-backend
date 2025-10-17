import { Types } from 'mongoose';

export type PaymentStatus = 'Pending' | 'Paid' | 'Cancelled';

export type TPurchase = {
  customer: Types.ObjectId;
  design: Types.ObjectId;
  pricingPlan: Types.ObjectId;
  paymentStatus: PaymentStatus;
  purchaseDate: Date;
};
