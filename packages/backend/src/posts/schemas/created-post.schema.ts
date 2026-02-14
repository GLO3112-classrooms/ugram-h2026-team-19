import z from 'zod';

export const createdPostSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the created post' }),
});

export type CreatedPost = z.infer<typeof createdPostSchema>;
