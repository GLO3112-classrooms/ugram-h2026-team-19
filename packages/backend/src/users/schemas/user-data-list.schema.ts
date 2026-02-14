import z from 'zod';
import { userPartialDataSchema } from './user-partial-data.schema.js';

export const userDataListQuerySchema = z.object({
  search: z.string().optional().meta({
    description: 'The string to search for in the users attributes.',
  }),
  limit: z.coerce
    .number()
    .positive()
    .min(1)
    .max(50)
    .optional()
    .default(10)
    .meta({
      description: 'The maximum number of users to return.',
    }),
  skip: z.coerce.number().positive().min(1).max(1).optional().default(0).meta({
    description: 'The number of users to skip.',
  }),
});

export const userDataListSchema = z.object({
  users: z.array(userPartialDataSchema).meta({
    description: 'The list of users',
  }),
  total: z.number().positive().min(0).default(0).meta({
    description: 'The total number of users',
  }),
});

export type UserDataListSchema = z.infer<typeof userDataListSchema>;
