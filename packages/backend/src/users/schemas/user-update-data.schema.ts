import z from 'zod';
import { PHONE_NUMBER_REGEX } from '../../constants.js';

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
  phoneNumber: z
    .string()
    .regex(PHONE_NUMBER_REGEX, {
      error:
        'Invalid phone number: must contain only digits and be between 9 and 12 characters',
    })
    .optional()
    .meta({ description: 'The user phone number' }),
});

export type UserUpdateData = z.infer<typeof userUpdateDataSchema>;
