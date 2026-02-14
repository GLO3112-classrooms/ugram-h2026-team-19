import z from 'zod';

export const postDataAuthorSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the author' }),
  username: z.string().meta({
    description: 'The author username',
  }),
  profilePicture: z.string().meta({
    description: 'The author profile picture URL (empty string if none)',
  }),
});

export const postDataSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the post' }),
  description: z.string().meta({
    description: 'The post description',
  }),
  keywords: z.array(z.string()).meta({
    description: 'The post keywords (hashtags)',
  }),
  mentions: z.array(z.uuid()).meta({
    description: 'The post user mentions (list of user ID)',
  }),
  image: z.string().meta({
    description: 'The post image URL (empty string if none)',
  }),
  user: postDataAuthorSchema.meta({
    description: 'The post author',
  }),
  createdAt: z.iso.datetime().meta({
    description: 'The post creation datetime (ISO format)',
  }),
});

export type PostData = z.infer<typeof postDataSchema>;
