import { z } from "zod";

export const programRegistrationSchema = z.object({
  name: z.string().min(1, "program name is required"),
  description: z.string().min(1, "briefly describe the program"),
});

export const programEnrollmentFormSchema = z.object({
  programIds: z.array(z.string()).optional(),
});

export type ProgramRegistrationSchema = z.output<
  typeof programRegistrationSchema
>;

export type ProgramEnrollmentFormSchema = z.output<
  typeof programEnrollmentFormSchema
>;
