import { createZodDto } from 'nestjs-zod';
import { userTokenSchema } from '../../../../shared/src/auth/index.js';

export class UserTokenDto extends createZodDto(userTokenSchema) {}
