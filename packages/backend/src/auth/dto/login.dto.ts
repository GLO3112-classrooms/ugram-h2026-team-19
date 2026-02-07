import { createZodDto } from 'nestjs-zod';
import { authLoginSchema } from '../../../../shared/src/auth/index.js';

export class AuthLoginDto extends createZodDto(authLoginSchema) {}
