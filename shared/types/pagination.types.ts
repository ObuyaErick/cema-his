export interface PaginationParams {
  page: number;
  limit: number;
}

export interface Paginated<D> extends PaginationParams {
  total: number;
  data: D[];
}
