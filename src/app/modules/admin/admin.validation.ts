import z, { email } from 'zod';

const createAdminSchemaValidation = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    position: z.enum(['Administrator', 'Manager']).optional(),
    profileImage: z.string().url('Invalid URL').optional(),
    phone: z
      .string()
      .min(11, 'Phone number must be at least 11 characters long')
      .optional(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters long')
      .optional(),
  }),
});

const updateAdminSchemaValidation = z.object({
  body: z.object({
    position: z.enum(['Administrator', 'Manager']).optional(),
  }),
});

export { createAdminSchemaValidation, updateAdminSchemaValidation };
