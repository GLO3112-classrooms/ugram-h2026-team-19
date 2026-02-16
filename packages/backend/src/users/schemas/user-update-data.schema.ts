import z from 'zod';

export const userUpdateDataSchema = z.object({
  email: z.email().optional().meta({
    description: 'The user email',
  }),
  firstname: z.string().optional().meta({
    description: 'The user firstname',
  }),
  lastname: z.string().optional().meta({
    description: 'The user lastname',
  }),
  phoneNumber: z.string().optional().meta({
    description: 'The user phone number',
  }),
});

export type UserUpdateData = z.infer<typeof userUpdateDataSchema>;
