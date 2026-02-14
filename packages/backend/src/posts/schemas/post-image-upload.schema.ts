import { z } from 'zod';

export const POST_IMAGE_UPLOAD_MIME_TYPES: z.core.util.MimeTypes[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const POST_IMAGE_UPLOAD_MAX_SIZE = 1024 * 1024; /* 1MB */

export const postImageUploadSchema = z.object({
  image: z
    .file()
    .mime(POST_IMAGE_UPLOAD_MIME_TYPES)
    .max(POST_IMAGE_UPLOAD_MAX_SIZE)
    .meta({
      description: "The binary file representing the post's new image.",
    }),
});

export const postImageUploadResponseSchema = z.object({
  imageUrl: z.url().meta({
    description: "The absolute URL path to the post's image static file.",
  }),
});
