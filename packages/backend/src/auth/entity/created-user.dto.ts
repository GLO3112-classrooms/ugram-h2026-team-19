import { createZodDto } from 'nestjs-zod';
import { createdUserSchema } from '../../../../shared/src/auth/index.js';

export class CreatedUserDto extends createZodDto(createdUserSchema) {}
