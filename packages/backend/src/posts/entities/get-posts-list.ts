import { createZodDto } from 'nestjs-zod';
import { getPostsQuerySchema } from '../schemas/get-posts-list.schema.js';

export class GetPostsQueryDto extends createZodDto(getPostsQuerySchema) {}
