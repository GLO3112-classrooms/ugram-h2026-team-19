import z from 'zod';

export const getPostsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10).meta({
    description: 'The number of posts to return',
  }),
  skip: z.coerce.number().min(0).optional().default(0).meta({
    description: 'The number of posts to skip',
  }),
});

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
