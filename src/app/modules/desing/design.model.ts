// src/models/Design.ts
import mongoose, { Schema } from 'mongoose';
import { TDesign } from './design.types';

const designSchema = new Schema<TDesign>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    previewImageUrl: {
      type: String,
      required: [true, 'Preview image URL is required'],
    },
    designerName: {
      type: String,
      required: [true, 'Designer name is required'],
    },
    usedTools: [
      {
        type: String,
        required: [true, 'At least one tool is required'],
        trim: true,
      },
    ],
    effects: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    process: {
      type: String,
      required: [true, 'Process description is required'],
    },
    complexityLevel: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced'],
      required: [true, 'Complexity level is required'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archived'],
      default: 'Draft',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model<TDesign>('design', designSchema);

export default Design;
