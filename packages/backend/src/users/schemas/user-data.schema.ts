import z from 'zod';
import { PHONE_NUMBER_REGEX } from '../../constants.js';

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
  phoneNumber: z
    .string()
    .regex(PHONE_NUMBER_REGEX, {
      error:
        'Invalid phone number: must contain only digits and be between 9 and 12 characters',
    })
    .meta({
      description: 'The user phone number',
    }),
  profilePicture: z.string().meta({
    description: 'The user profile picture URL (empty string if none)',
  }),
  createdAt: z.iso.datetime().meta({
    description: 'The user creation datetime (ISO format)',
  }),
});

export type UserData = z.infer<typeof userDataSchema>;
