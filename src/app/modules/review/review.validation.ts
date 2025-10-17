import z from 'zod';

const createReviewSchemaValidation = z.object({
  body: z.object({
    design: z.string().length(24, 'Invalid design ID'),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }),
});

const updateReviewSchemaValidation = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
  params: z.object({
    id: z.string().length(24, 'Invalid review ID'),
  }),
});

export { createReviewSchemaValidation, updateReviewSchemaValidation };
