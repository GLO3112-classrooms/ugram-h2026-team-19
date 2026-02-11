import { z } from 'zod';

export const USER_AVATAR_UPLOAD_MIME_TYPES: z.core.util.MimeTypes[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const USER_AVATAR_UPLOAD_MAX_SIZE = 1024 * 1024; /* 1MB */

export const userAvatarUploadSchema = z.object({
  avatar: z
    .file()
    .mime(USER_AVATAR_UPLOAD_MIME_TYPES)
    .max(USER_AVATAR_UPLOAD_MAX_SIZE)
    .meta({
      description: "The binary file representing the user's new avatar.",
    }),
});

export const userAvatarUploadResponseSchema = z.object({
  avatarUrl: z.url().meta({
    description: "The absolute URL path to the user's avatar static file.",
  }),
});
