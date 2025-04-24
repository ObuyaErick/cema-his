import type { PaginationParams } from "../types/pagination.types";

export default function (
  queryObject: any,
  defaultOptions: Partial<PaginationParams> = { page: 1, limit: 6 }
): PaginationParams {
  if (typeof queryObject === "object") {
    return {
      page: Number(queryObject.page ?? (defaultOptions.page || 1)) || 1,
      limit: Number(queryObject.limit ?? (defaultOptions.limit || 6)) || 1,
    };
  }
  return {
    page: Number(defaultOptions.page || 1),
    limit: Number(defaultOptions.limit || 6),
  };
}
