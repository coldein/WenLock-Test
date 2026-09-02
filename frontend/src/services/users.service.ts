import { api } from '../api/api';

import type {
    CreateUserPayload,
    FindUsersParams,
    PaginatedUsersResponse,
    UpdateUserPayload,
    User,
} from '../types/user';

export const usersService = {
    async findAll(
        params: FindUsersParams = {},
    ): Promise<PaginatedUsersResponse> {
        const response =
            await api.get<PaginatedUsersResponse>(
                '/users',
                {
                    params,
                },
            );

        return response.data;
    },

    async findOne(
        id: number,
    ): Promise<User> {
        const response =
            await api.get<User>(
                `/users/${id}`,
            );

        return response.data;
    },

    async create(
        data: CreateUserPayload,
    ): Promise<User> {
        const response =
            await api.post<User>(
                '/users',
                data,
            );

        return response.data;
    },

    async update(
        id: number,
        data: UpdateUserPayload,
    ): Promise<User> {
        const response =
            await api.patch<User>(
                `/users/${id}`,
                data,
            );

        return response.data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    },
};