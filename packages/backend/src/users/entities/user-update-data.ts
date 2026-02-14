import { createZodDto } from 'nestjs-zod';
import { userUpdateDataSchema } from '../schemas/user-update-data.schema.js';

export class UserUpdateDataDto extends createZodDto(userUpdateDataSchema) {}
