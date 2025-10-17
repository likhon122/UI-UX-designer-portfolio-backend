import { Schema, model } from 'mongoose';
import { TAdmin } from './admin.types';

const adminSchema = new Schema<TAdmin>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    position: {
      type: String,
      enum: ['Administrator', 'Manager'],
      default: 'Administrator',
    },
    profileImage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Admin = model<TAdmin>('admin', adminSchema);
