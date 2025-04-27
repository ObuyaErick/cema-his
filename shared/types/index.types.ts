export interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export type AlertResponse = { message: string; status: "success" | "error" };
