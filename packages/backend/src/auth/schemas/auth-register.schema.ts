import z from 'zod';
import { PHONE_NUMBER_REGEX } from '../../constants.js';

export const authRegisterSchema = z.object({
  email: z.email().meta({
    description: 'The user email',
  }),
  username: z.string().meta({
    description: 'The user username',
  }),
  password: z.string().min(8).meta({
    description: 'The user password',
  }),
  firstname: z.string().meta({
    description: 'The user firstname',
  }),
  lastname: z.string().meta({
    description: 'The user lastname',
  }),
  phoneNumber: z
    .string()
    .regex(PHONE_NUMBER_REGEX, { error: 'Invalid phone number' })
    .meta({
      description: 'The user phone number',
    }),
});

export type AuthRegister = z.infer<typeof authRegisterSchema>;
