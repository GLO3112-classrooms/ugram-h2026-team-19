import { createZodDto } from 'nestjs-zod';
import { authRegisterSchema } from '../schemas/auth-register.schema.js';

export class AuthRegisterDto extends createZodDto(authRegisterSchema) {}
