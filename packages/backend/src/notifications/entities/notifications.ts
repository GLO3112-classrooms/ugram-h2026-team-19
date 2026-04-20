import { createZodDto } from 'nestjs-zod';
import { notificationSchema } from '../schemas/notifications-list.schema.js';

export class NotificationsListGetDto extends createZodDto(notificationSchema) {}
