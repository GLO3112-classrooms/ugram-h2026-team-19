import * as z from "zod";
import { postCreateSchema, postImageUploadSchema } from "backend/schemas";

export const createPostSchema = postCreateSchema
  .extend(postImageUploadSchema.shape)
  .extend({ keywords: z.string().optional(), mention: z.string().optional() })
  .omit({ mentions: true });
