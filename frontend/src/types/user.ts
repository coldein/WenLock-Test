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

export interface CreateUserPayload {
  name: string;
  email: string;
  registration: string;
  password: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    registration?: string;
    password?: string;
}