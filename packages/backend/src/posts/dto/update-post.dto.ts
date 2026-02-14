import { createZodDto } from 'nestjs-zod';
import { postUpdateSchema } from '../schemas/post-update.schema.js';

export class PostUpdateDto extends createZodDto(postUpdateSchema) {}
