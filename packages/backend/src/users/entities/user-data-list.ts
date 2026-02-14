import { createZodDto } from 'nestjs-zod';
import {
  userDataListQuerySchema,
  userDataListSchema,
} from '../schemas/user-data-list.schema.js';

export class UserDataListQueryDto extends createZodDto(
  userDataListQuerySchema,
) {}

export class UserDataListDto extends createZodDto(userDataListSchema) {}
