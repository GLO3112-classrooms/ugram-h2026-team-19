import z from 'zod';

export const postCreateCommentSchema = z.object({
  content: z.string().min(1).meta({
    description: 'The content of the post to comment on.',
  }),
});

export type PostCreateComment = z.infer<typeof postCreateCommentSchema>;
