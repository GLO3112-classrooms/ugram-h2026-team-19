import z from 'zod';

export const postCreateSchema = z.object({
  description: z.string().meta({
    description: 'The post description',
  }),
  keywords: z.array(z.string()).optional().default([]).meta({
    description: 'The post keywords (hashtags)',
  }),
  mentions: z.array(z.uuid()).optional().default([]).meta({
    description: 'The post user mentions (ID of the user)',
  }),
});

export type PostCreate = z.infer<typeof postCreateSchema>;
