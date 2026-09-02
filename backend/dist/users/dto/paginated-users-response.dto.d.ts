import { UserResponseDto } from './user-response.dto';
export declare class PaginationMetaDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}
export declare class PaginatedUsersResponseDto {
    data: UserResponseDto[];
    meta: PaginationMetaDto;
}
