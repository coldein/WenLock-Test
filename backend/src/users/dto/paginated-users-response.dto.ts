import { UserResponseDto } from './user-response.dto';

export class PaginationMetaDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedUsersResponseDto {
    data: UserResponseDto[];
    meta: PaginationMetaDto;
}