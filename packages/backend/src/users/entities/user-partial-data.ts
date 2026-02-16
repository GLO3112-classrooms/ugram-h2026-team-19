import { createZodDto } from 'nestjs-zod';
import { userPartialDataSchema } from '../schemas/user-partial-data.schema.js';

export class UserPartialDataDto extends createZodDto(userPartialDataSchema) {}
