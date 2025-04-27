import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "title is required"),
  content: z.string().min(1, "provide details on this note"),
});

export type CreateNoteSchema = z.output<typeof createNoteSchema>;
