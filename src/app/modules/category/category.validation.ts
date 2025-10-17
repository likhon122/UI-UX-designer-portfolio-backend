import { z } from 'zod';

export const createCategorySchemaValidation = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
});

export const updateCategorySchemaValidation = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
  }),
  params: z.object({
    // validate mongodb id
    id: z.string().length(24, 'Invalid category id'),
  }),
});
