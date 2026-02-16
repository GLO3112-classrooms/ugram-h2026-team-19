import z from 'zod';

export const userTokenDataSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the authenticated user' }),
});

export type UserTokenData = z.infer<typeof userTokenDataSchema>;
