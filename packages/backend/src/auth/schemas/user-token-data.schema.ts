import z from 'zod';

export const userTokenDataSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the authenticated user' }),
  iat: z
    .number()
    .int()
    .meta({ description: 'The timestamp when the token was issued' }),
  exp: z
    .number()
    .int()
    .meta({ description: 'The timestamp when the token will expire' }),
});

export type UserTokenData = z.infer<typeof userTokenDataSchema>;
