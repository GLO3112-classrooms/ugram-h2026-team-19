import z from 'zod';

export const createdPrivateMessageSchema = z.object({
  id: z.uuid().meta({ description: 'The ID of the created post' }),
  to: z.uuid().meta({
    description: 'The ID of the user to which the message is destinated',
  }),
  from: z.uuid().meta({
    description: 'The ID of the user who sent the message',
  }),
  content: z.string().meta({
    description: 'The content of the message',
  }),
  createdAt: z.iso.datetime().meta({
    description: 'The date of creation of the message',
  }),
});

export type CreatedPrivateMessage = z.infer<typeof createdPrivateMessageSchema>;
