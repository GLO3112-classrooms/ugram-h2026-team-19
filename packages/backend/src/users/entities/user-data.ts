import { createZodDto } from 'nestjs-zod';
import { userDataSchema } from '../schemas/user-data.schema.js';

export class UserDataDto extends createZodDto(userDataSchema) {}
