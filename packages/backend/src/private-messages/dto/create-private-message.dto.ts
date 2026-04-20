import { createZodDto } from 'nestjs-zod';
import { privateMessageCreateSchema } from '../schemas/private-message-create.schema.js';

export class PrivateMessageCreateDto extends createZodDto(
  privateMessageCreateSchema,
) {}
