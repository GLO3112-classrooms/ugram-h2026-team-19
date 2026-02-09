import { createZodDto } from 'nestjs-zod';
import { authLoginSchema } from '../schemas/auth-login.schema.js';

export class AuthLoginDto extends createZodDto(authLoginSchema) {}
