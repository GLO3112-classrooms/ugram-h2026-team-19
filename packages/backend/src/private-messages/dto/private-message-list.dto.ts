import { createZodDto } from 'nestjs-zod';
import { privateMessageListSchema } from '../schemas/private-message-list.schema.js';

export class PrivateMessageListDto extends createZodDto(
  privateMessageListSchema,
) {}
