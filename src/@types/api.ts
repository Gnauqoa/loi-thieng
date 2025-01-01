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

export type GetByIdParams = {
  id: number | string;
  useCache?: boolean;
};

export const defaultGetByIdParams: GetByIdParams = {
  id: "",
  useCache: true,
};

export type ReducerDataType<T> = T & {
  isLoading: boolean;
};

export type PaginationMeta<T> = {
  items: ReducerDataType<T>[];
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
};
