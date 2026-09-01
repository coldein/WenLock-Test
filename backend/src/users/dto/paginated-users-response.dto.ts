import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class PaginationMetaDto {
    @ApiProperty({
        example: 1,
    })
    page: number;

    @ApiProperty({
        example: 15,
    })
    limit: number;

    @ApiProperty({
        example: 42,
    })
    totalItems: number;

    @ApiProperty({
        example: 3,
    })
    totalPages: number;
}

export class PaginatedUsersResponseDto {
    @ApiProperty({
        type: [UserResponseDto],
    })
    data: UserResponseDto[];

    @ApiProperty({
        type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;
}