import z from 'zod';

export const googleProfileSchema = z.object({
  id: z.string().meta({
    description: 'The google profile ID',
  }),
  email: z.email().meta({
    description: 'The email address',
  }),
  verified_email: z.boolean().meta({
    description: 'Whether the email address has been verified by Google',
  }),
  name: z.string().meta({
    description: 'The full name of the user',
  }),
  given_name: z.string().meta({
    description: 'The given name of the user',
  }),
  family_name: z.string().meta({
    description: 'The family name of the user',
  }),
  picture: z.url().meta({
    description: 'The picture of the user',
  }),
});

export type GoogleProfile = z.infer<typeof googleProfileSchema>;
