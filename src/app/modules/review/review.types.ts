import { Types } from 'mongoose';

export type TReview = {
  reviewer: Types.ObjectId;
  design: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
};
