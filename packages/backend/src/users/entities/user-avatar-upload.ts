import { createZodDto } from 'nestjs-zod';
import {
  userAvatarUploadResponseSchema,
  userAvatarUploadSchema,
} from '../schemas/user-avatar-upload.schema.js';

export class UserAvatarUploadDto extends createZodDto(userAvatarUploadSchema) {}

export class UserAvatarUploadResponseDto extends createZodDto(
  userAvatarUploadResponseSchema,
) {}
