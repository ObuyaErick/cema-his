import type { User } from "~/generated/prisma";

export type UIUser = Omit<User, "password">;
