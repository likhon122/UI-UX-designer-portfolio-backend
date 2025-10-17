import { Types } from 'mongoose';

export type Complexity = 'Basic' | 'Intermediate' | 'Advanced';
export type Status = 'Active' | 'Draft' | 'Archived';

export type TDesign = {
  title: string;
  category: Types.ObjectId;
  description: string;
  previewImageUrl: string;
  designerName: string;
  usedTools: string[];
  effects?: string[];
  price: number;
  process: string;
  complexityLevel: Complexity;
  tags: string[];
  status: Status;
  likesCount: number;
  downloadsCount: number;
};
