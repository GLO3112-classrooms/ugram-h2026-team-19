import { createZodDto } from 'nestjs-zod';
import { userDataSchema } from '../../../../shared/src/users/index.js';

export class UserDataDto extends createZodDto(userDataSchema) {}
