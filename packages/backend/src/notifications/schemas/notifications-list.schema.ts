import z from 'zod';

const notificationActorSchema = z.object({
  id: z.uuid().meta({
    description: 'The ID of the user who triggered the notification.',
  }),
  username: z.string().meta({ description: 'The username of the actor.' }),
  profilePicture: z
    .string()
    .meta({ description: 'The profile picture URL of the actor.' }),
});

const notificationPostSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the related post.' }),
  description: z
    .string()
    .meta({ description: 'The description of the related post.' }),
});

const notificationTypeSchema = z
  .enum([
    'POST_LIKED',
    'POST_UNLIKED',
    'POST_COMMENTED',
    'POST_COMMENT_DELETED',
  ])
  .meta({ description: 'The type of notification.' });

export const notificationSchema = z.object({
  id: z.string().uuid().meta({ description: 'The ID of the notification.' }),
  type: notificationTypeSchema,
  read: z
    .boolean()
    .meta({ description: 'Whether the notification has been read.' }),
  createdAt: z
    .string()
    .datetime()
    .meta({ description: 'The notification creation datetime (ISO format).' }),
  actor: notificationActorSchema,
  post: notificationPostSchema.nullable(),
});

export const notificationsListSchema = z.array(notificationSchema);

export type Notification = z.infer<typeof notificationSchema>;
export type NotificationsList = z.infer<typeof notificationsListSchema>;
