import { createZodDto } from 'nestjs-zod';
import { createdPrivateMessageSchema } from '../schemas/created-private-message.schema.js';

export class CreatedPrivateMessageDto extends createZodDto(
  createdPrivateMessageSchema,
) {}
