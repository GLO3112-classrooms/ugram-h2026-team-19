import z from 'zod';

export const postUserSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the user' }),
  username: z.string().meta({
    description: 'The username',
  }),
  profilePicture: z.string().meta({
    description: 'The user profile picture URL (empty string if none)',
  }),
});

export const postKeywordSchema = z.object({
  value: z.string().meta({
    description: 'The keyword for this post data.',
  }),
});

export const postCommentSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the comment' }),
  content: z.string().min(1).meta({
    description: 'The content of the post to comment on.',
  }),
  createdAt: z.iso.datetime().meta({
    description: 'The post creation datetime (ISO format)',
  }),
  user: postUserSchema.meta({
    description: 'The comment author',
  }),
});

export const postDataSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the post' }),
  description: z.string().meta({
    description: 'The post description',
  }),
  keywords: z.array(postKeywordSchema).meta({
    description: 'The post keywords (hashtags)',
  }),
  mentions: z.array(postUserSchema).meta({
    description: 'The post user mentions',
  }),
  reactions: z.array(postUserSchema).meta({
    description: 'The users who reacted to the post',
  }),
  comments: z.array(postCommentSchema).meta({
    description: 'The post comments',
  }),
  image: z.string().meta({
    description: 'The post image URL (empty string if none)',
  }),
  user: postUserSchema.meta({
    description: 'The post author',
  }),
  createdAt: z.iso.datetime().meta({
    description: 'The post creation datetime (ISO format)',
  }),
});

export type PostComment = z.infer<typeof postCommentSchema>;
export type PostData = z.infer<typeof postDataSchema>;
