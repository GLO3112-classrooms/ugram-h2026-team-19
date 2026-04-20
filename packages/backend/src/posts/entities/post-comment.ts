import { createZodDto } from 'nestjs-zod';
import { postCommentSchema } from '../schemas/post-data.schema.js';

export class PostCommentDto extends createZodDto(postCommentSchema) {}
