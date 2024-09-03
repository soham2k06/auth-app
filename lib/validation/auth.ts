import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstname: z.string().min(2, { message: "Min 2 characters" }),
  lastname: z.string().min(2, { message: "Min 2 characters" }),
  organization: z.string().optional(),
  role: z.string().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
