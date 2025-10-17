import z from 'zod';

const createPurchaseSchemaValidation = z.object({
  body: z.object({
    design: z.string().length(24, 'Invalid design ID'),
    pricingPlan: z.string().length(24, 'Invalid pricing plan ID'),
  }),
});

const updatePurchaseSchemaValidation = z.object({
  body: z.object({
    paymentStatus: z.enum(['Paid', 'Cancelled']),
  }),
  params: z.object({
    id: z.string().length(24, 'Invalid purchase ID'),
  }),
});

export { createPurchaseSchemaValidation, updatePurchaseSchemaValidation };
