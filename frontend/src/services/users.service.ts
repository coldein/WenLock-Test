import { api } from '../api/api';

import type {
    CreateUserPayload,
    FindUsersParams,
    PaginatedUsersResponse,
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
};