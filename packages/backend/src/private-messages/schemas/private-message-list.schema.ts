import z from 'zod';

export const privateMessageSchema = z.object({
  id: z.uuid().meta({
    description: 'The message ID',
  }),
  from: z.uuid().meta({
    description: 'The ID of the user who sent the message',
  }),
  content: z.string().meta({
    description: 'The content of the message',
  }),
  createdAt: z.iso.datetime().meta({
    description: 'The creation date of the message',
  }),
});

export const privateMessageListSchema = z.array(privateMessageSchema).meta({
  description: 'The list of private messages, most recent first',
});

export type PrivateMessageList = z.infer<typeof privateMessageListSchema>;
