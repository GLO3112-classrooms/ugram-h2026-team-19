import { createZodDto } from 'nestjs-zod';
import { createdPostSchema } from '../schemas/created-post.schema.js';

export class CreatedPostDto extends createZodDto(createdPostSchema) {}
