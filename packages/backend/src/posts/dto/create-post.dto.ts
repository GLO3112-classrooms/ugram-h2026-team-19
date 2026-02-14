import { createZodDto } from 'nestjs-zod';
import { postCreateSchema } from '../schemas/post-create.schema.js';

export class PostCreateDto extends createZodDto(postCreateSchema) {}
