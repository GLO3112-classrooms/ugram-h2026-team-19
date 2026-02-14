import z from 'zod';
import { postDataSchema } from './post-data.schema.js';

export const postDataListSchema = z.object({
  posts: z.array(postDataSchema).meta({
    description: 'The list of post',
  }),
  total: z.number().positive().min(0).default(0).meta({
    description: 'The total number of posts to fetch',
  }),
});

export type PostDataList = z.infer<typeof postDataListSchema>;
