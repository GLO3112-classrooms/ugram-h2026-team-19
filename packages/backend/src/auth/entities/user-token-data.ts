import { createZodDto } from 'nestjs-zod';
import { userTokenDataSchema } from '../../../../shared/src/auth/index.js';

export class UserTokenDataDto extends createZodDto(userTokenDataSchema) {}
