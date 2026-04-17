import z from 'zod';

export const keywordDataSchema = z.object({
  value: z.string().meta({
    description: 'The keyword value.',
  }),
  count: z.number().meta({
    description: 'The popularity rank for this keyword value.',
  }),
});

export type KeywordData = z.infer<typeof keywordDataSchema>;
