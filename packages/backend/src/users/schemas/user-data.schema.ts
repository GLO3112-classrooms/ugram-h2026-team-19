import z from 'zod';

export const userDataSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the authenticated user' }),
  email: z.email().meta({
    description: 'The user email',
  }),
  username: z.string().meta({
    description: 'The user username',
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
  createdAt: z.iso.datetime().meta({
    description: 'The user creation datetime (ISO format)',
  }),
});

export type UserData = z.infer<typeof userDataSchema>;
