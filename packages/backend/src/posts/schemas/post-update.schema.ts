import z from 'zod';

export const postUpdateSchema = z.object({
  description: z.string().nullable().default(null).meta({
    description: 'The post description',
  }),
  keywords: z.array(z.string()).nullable().default(null).meta({
    description: 'The post keywords (hashtags)',
  }),
  mentions: z.array(z.uuid()).nullable().default(null).meta({
    description: 'The post user mentions (ID of the user)',
  }),
});

export type PostUpdate = z.infer<typeof postUpdateSchema>;
