import { z } from "zod";

export const programRegistrationSchema = z.object({
  name: z.string().min(1, "program name is required"),
  description: z.string().min(1, "briefly describe the program"),
});

export type ProgramRegistrationSchema = z.output<
  typeof programRegistrationSchema
>;
