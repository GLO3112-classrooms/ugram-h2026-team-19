import { createZodDto } from 'nestjs-zod';
import { healthStatusGetSchema } from '../schemas/health-status.schema.js';

export class HealthStatusGetDto extends createZodDto(healthStatusGetSchema) {}
