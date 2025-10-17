import { z } from 'zod';

export const createDesignSchemaValidation = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),

    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid category ID' }),

    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' }),

    previewImageUrl: z
      .string()
      .url({ message: 'Preview image URL must be a valid URL' }),

    designerName: z.string().min(1, { message: 'Designer name is required' }),

    usedTools: z
      .array(z.string().min(1, { message: 'Tool name cannot be empty' }))
      .min(1, { message: 'At least one tool is required' }),

    effects: z.array(z.string().trim()).optional().default([]),

    price: z.number().nonnegative({ message: 'Price cannot be negative' }),

    process: z.string().min(5, {
      message: 'Process description must be at least 5 characters long',
    }),

    complexityLevel: z.enum(['Basic', 'Intermediate', 'Advanced'], {
      message: 'Complexity level is required',
    }),

    tags: z.array(z.string().trim()).optional().default([]),

    status: z.enum(['Active', 'Draft', 'Archived']).optional().default('Draft'),
  }),
});

export const updateDesignSchemaValidation = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required' })
      .optional(),

    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid category ID' })
      .optional(),

    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' })
      .optional(),

    previewImageUrl: z
      .string()
      .url({ message: 'Preview image URL must be a valid URL' })
      .optional(),

    designerName: z
      .string()
      .min(1, { message: 'Designer name is required' })
      .optional(),

    usedTools: z
      .array(z.string().min(1, { message: 'Tool name cannot be empty' }))
      .min(1, { message: 'At least one tool is required' })
      .optional(),

    effects: z.array(z.string().trim()).optional(),

    price: z
      .number()
      .nonnegative({ message: 'Price cannot be negative' })
      .optional(),

    process: z
      .string()
      .min(5, {
        message: 'Process description must be at least 5 characters long',
      })
      .optional(),

    complexityLevel: z.enum(['Basic', 'Intermediate', 'Advanced']).optional(),

    tags: z.array(z.string().trim()).optional(),

    status: z.enum(['Active', 'Draft', 'Archived']).optional(),
  }),
});
