/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Query, Schema } from 'mongoose';
import { hashPassword } from '../../utils/password';
import { TUser } from './user.types';

const userSchema = new Schema<TUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'customer', 'superAdmin'],
      default: 'customer',
    },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Use bcrypt to hash passwords before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// When find the user do not return the password field
userSchema.pre<Query<any, TUser>>(/^find/, function (next) {
  const projection = (this.getQuery() as any).projection || this.projection();

  // Only exclude password if no other projection is applied
  if (!projection || Object.keys(projection).length === 0) {
    this.select('-password');
  }

  next();
});

export const User = model<TUser>('user', userSchema);
