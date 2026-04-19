import z from 'zod';

export const privateMessageCreateSchema = z.object({
  to: z.uuid().meta({
    description: 'The ID of the user to send the message to',
  }),
  content: z.string().meta({
    description: 'The content of the message',
  }),
});

export type PrivateMessageCreate = z.infer<typeof privateMessageCreateSchema>;
