import z from "zod";

export const createdUserSchema = z.object({
  id: z.uuid().meta({ description: "The ID of the created user" }),
});

export type CreatedUserDto = z.infer<typeof createdUserSchema>;

export const userTokenSchema = z.object({
  token: z.jwt().meta({
    description: "The user session token. It contains the ID of the user",
  }),
});

export type UserTokenDto = z.infer<typeof userTokenSchema>;

export const userTokenDataSchema = z.object({
  id: z.uuid().meta({ description: "The ID of the authenticated user" }),
});

export type UserTokenDataDto = z.infer<typeof userTokenDataSchema>;

export const authRegisterSchema = z.object({
  email: z.email().meta({
    description: "The user email",
  }),
  password: z.string().meta({
    description: "The user password",
  }),
  firstname: z.string().meta({
    description: "The user firstname",
  }),
  lastname: z.string().meta({
    description: "The user lastname",
  }),
  phoneNumber: z.string().meta({
    description: "The user phone number",
  }),
  profilePicture: z.string().meta({
    description: "The user profile picture URL",
  }),
});

export type AuthRegisterDto = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z.object({
  email: z.email().meta({
    description: "The user email",
  }),
  password: z.string().meta({
    description: "The user password",
  }),
});

export type AuthLoginDto = z.infer<typeof authLoginSchema>;
