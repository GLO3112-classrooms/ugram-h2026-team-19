import z from 'zod';

export const authRegisterSchema = z.object({
  email: z.email().meta({
    description: 'The user email',
  }),
  username: z.string().meta({
    description: 'The user username',
  }),
  password: z.string().meta({
    description: 'The user password',
  }),
  firstname: z.string().meta({
    description: 'The user firstname',
  }),
  lastname: z.string().meta({
    description: 'The user lastname',
  }),
  phoneNumber: z.string().meta({
    description: 'The user phone number',
  }),
  profilePicture: z.string().meta({
    description: 'The user profile picture URL',
  }),
});

export type AuthRegister = z.infer<typeof authRegisterSchema>;
