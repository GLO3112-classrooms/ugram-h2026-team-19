import { createZodDto } from 'nestjs-zod';
import { createdUserSchema } from '../schemas/create-user.schema.js';

export class CreatedUserDto extends createZodDto(createdUserSchema) {}
