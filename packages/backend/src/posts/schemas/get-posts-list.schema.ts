import z from 'zod';

export const getPostsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional().default(10).meta({
    description: 'The number of posts to return',
  }),
  skip: z.coerce.number().min(0).optional().default(0).meta({
    description: 'The number of posts to skip',
  }),
  keywords: z.string().optional().meta({
    description:
      'A comma-separated list of keywords to filter posts by. Only posts containing all the specified keywords will be returned.',
  }),
  description: z.string().optional().meta({
    description:
      'A string to search for in the post descriptions. Only posts whose description contains this string will be returned.',
  }),
});

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
