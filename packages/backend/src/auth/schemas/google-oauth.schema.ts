import z from 'zod';

export const googleAuthTokenSchema = z.object({
  access_token: z.string().meta({
    description: 'The access token',
  }),
  expires_in: z.number().meta({
    description: 'The expires in time in seconds',
  }),
  scope: z.string().meta({
    description: 'The scopes granted',
  }),
  token_type: z.string().meta({
    description: 'The type of the token, usually "Bearer"',
  }),
  id_token: z.string().meta({
    description: 'The id of the token',
  }),
});

export type GoogleAuthToken = z.infer<typeof googleAuthTokenSchema>;
