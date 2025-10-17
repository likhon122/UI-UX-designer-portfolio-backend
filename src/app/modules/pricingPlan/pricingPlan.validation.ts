import { z } from 'zod';

export const pricingPlanSchemaValidation = z.object({
  body: z.object({
    name: z.enum(['Basic', 'Standard', 'Premium']),
    price: z.number().min(0),
    features: z.array(z.string()).min(1),
    duration: z.number().min(1),
  }),
});

export const updatePricingPlanSchemaValidation = z.object({
  body: z.object({
    name: z.enum(['Basic', 'Standard', 'Premium']).optional(),
    price: z.number().min(0).optional(),
    features: z.array(z.string()).min(1).optional(),
    duration: z.number().min(1).optional(),
  }),
  params: z.object({
    id: z.string().length(24, 'Invalid pricing plan ID'),
  }),
});
