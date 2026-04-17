import { createZodDto } from 'nestjs-zod';
import { keywordDataSchema } from '../schemas/keyword-data.schema.js';

export class KeywordDataDto extends createZodDto(keywordDataSchema) {}
