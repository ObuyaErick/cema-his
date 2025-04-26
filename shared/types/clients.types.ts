import { z } from "zod";

export const clientRegistrationSchema = z.object({
  firstName: z.string().min(1, "first name is required"),
  lastName: z.string().min(1, "last name is required"),
  dateOfBirth: z.coerce.date({
    required_error: "date of birth is required",
    invalid_type_error: "please select a valid date",
  }),
  gender: z.string().min(1, "gender is required"),
  contactNumber: z.string().min(1, "contact is required"),
  email: z.string().email("invalid email format"),
  address: z.string().optional(),
  programIds: z.array(z.string()).optional(),
});

export type ClientRegistrationSchema = z.output<
  typeof clientRegistrationSchema
>;
