import { createZodDto } from 'nestjs-zod';
import { postDataSchema } from '../schemas/post-data.schema.js';

export class PostDataDto extends createZodDto(postDataSchema) {}
