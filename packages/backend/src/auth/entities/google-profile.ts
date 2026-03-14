import { createZodDto } from 'nestjs-zod';
import { googleProfileSchema } from '../schemas/google-profile.schema.js';

export class GoogleProfileDto extends createZodDto(googleProfileSchema) {}
