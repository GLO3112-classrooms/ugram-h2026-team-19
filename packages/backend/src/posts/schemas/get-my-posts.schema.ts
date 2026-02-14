import z from 'zod';

export const getMyPostsQuerySchema = z.object({
  limit: z.number().positive().min(1).max(50).optional().default(10).meta({
    description: 'The number of posts to return',
  }),
  skip: z.number().positive().min(0).optional().default(0).meta({
    description: 'The number of posts to skip',
  }),
});

export type GetMyPostsQuery = z.infer<typeof getMyPostsQuerySchema>;
