import { createZodDto } from 'nestjs-zod';
import {
  postImageUploadResponseSchema,
  postImageUploadSchema,
} from '../schemas/post-image-upload.schema.js';

export class PostImageUploadDto extends createZodDto(postImageUploadSchema) {}

export class PostImageUploadResponseDto extends createZodDto(
  postImageUploadResponseSchema,
) {}
