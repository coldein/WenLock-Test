export interface User {
  id: number;
  name: string;
  email: string;
  registration: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export interface FindUsersParams {
  page?: number;
  limit?: number;
  name?: string;
}