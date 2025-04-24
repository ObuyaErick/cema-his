import type { User } from "~/generated/prisma";
import * as z from "zod";

export interface AuthenticationContext {
  principal: User;
}

export const loginSchema = z.object({
  email: z.string().email("invalid email"),
  password: z.string().min(8, { message: "must be at least 8 characters" }),
});

export type LoginSchema = z.output<typeof loginSchema>;

export const registrationSchema = z.object({
  email: z.string().email("invalid email"),
  name: z.string().min(6, { message: "must be at least 6 characters" }),
  password: z.string().min(8, { message: "must be at least 8 characters" }),
});

export type RegistrationSchema = z.output<typeof registrationSchema>;
