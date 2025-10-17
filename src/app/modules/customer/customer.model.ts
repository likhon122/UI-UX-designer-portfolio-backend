import { Schema, model } from 'mongoose';
import { TCustomer } from './customer,types';

const customerSchema = new Schema<TCustomer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    name: { type: String, required: true },
    phone: {
      type: String,
      unique: true,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    membership: {
      type: String,
      enum: ['Free', 'Basic', 'Standard', 'Premium'],
      default: 'Free',
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    profileImage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Customer = model<TCustomer>('customer', customerSchema);
