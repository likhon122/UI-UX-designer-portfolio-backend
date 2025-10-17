import z from 'zod';

const loginSchemaValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

const signUpSchemaValidation = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z
      .string()
      .min(11, 'Phone number must be at least 11 characters long')
      .optional(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters long')
      .optional(),
    profileImage: z.string().optional(),
  }),
});

const registerUserSchemaValidation = z.object({
  body: z.object({
    token: z.string(),
  }),
});

const forgotPasswordSchemaValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const resetPasswordSchemaValidation = z.object({
  body: z.object({
    changedPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

const changePasswordSchemaValidation = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
  }),
});

export {
  loginSchemaValidation,
  signUpSchemaValidation,
  registerUserSchemaValidation,
  forgotPasswordSchemaValidation,
  resetPasswordSchemaValidation,
  changePasswordSchemaValidation,
};
