import { createZodDto } from 'nestjs-zod';
import { postCreateCommentSchema } from '../schemas/post-create-comment.schema.js';

export class PostCommentCreateDto extends createZodDto(
  postCreateCommentSchema,
) {}
