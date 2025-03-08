import { z } from "zod";

const ACCEPTED_FILES = ["image/png", "image/jpeg", "image/webp"];

export const loginFormSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    image: z
      .instanceof(File)
      .refine((data) => ACCEPTED_FILES.includes(data.type), {
        message: "File must be a valid image type",
      })
      .optional(),
    name: z.string().min(3),
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
