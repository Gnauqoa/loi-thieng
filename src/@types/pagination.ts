export type PaginationParams = {
  per_page: number;
  page: number;
};

export type PaginationResponse<T> = {
  data: {
    items: T[];
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
};

export type DataResponse<T> = {
  data: T;
};

export type PaginationMeta<T> = {
  items: T[];
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
};
