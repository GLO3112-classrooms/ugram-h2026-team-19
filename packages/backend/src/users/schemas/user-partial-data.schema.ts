import z from 'zod';

export const userPartialDataSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the authenticated user' }),
  username: z.string().meta({
    description: 'The user username',
  }),
  firstname: z.string().meta({
    description: 'The user firstname',
  }),
  lastname: z.string().meta({
    description: 'The user lastname',
  }),
  profilePicture: z.string().meta({
    description: 'The user profile picture URL',
  }),
});

export type UserData = z.infer<typeof userPartialDataSchema>;
