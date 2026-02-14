import z from 'zod';

export const createdUserSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the created user' }),
});

export type CreatedUser = z.infer<typeof createdUserSchema>;
