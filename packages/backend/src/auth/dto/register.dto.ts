import { createZodDto } from 'nestjs-zod';
import { authRegisterSchema } from '../../../../shared/src/auth/index.js';

export class AuthRegisterDto extends createZodDto(authRegisterSchema) {}
