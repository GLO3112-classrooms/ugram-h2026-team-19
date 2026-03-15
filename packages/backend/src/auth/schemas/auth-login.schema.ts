import z from 'zod';

export const authLoginSchema = z.object({
  email: z.email().meta({
    description: 'The user email',
  }),
  password: z.string().nonempty().meta({
    description: 'The user password',
  }),
});

export type AuthLogin = z.infer<typeof authLoginSchema>;
