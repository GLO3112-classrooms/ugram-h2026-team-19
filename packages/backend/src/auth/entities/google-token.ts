import { createZodDto } from 'nestjs-zod';
import { googleAuthTokenSchema } from '../schemas/google-oauth.schema.js';

export class GoogleTokenDto extends createZodDto(googleAuthTokenSchema) {}
