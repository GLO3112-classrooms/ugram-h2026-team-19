import { createZodDto } from 'nestjs-zod';
import { postDataListSchema } from '../schemas/post-data-list.schema.js';

export class PostDataListDto extends createZodDto(postDataListSchema) {}
