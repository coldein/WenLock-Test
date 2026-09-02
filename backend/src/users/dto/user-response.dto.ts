import { ApiProperty } from '@nestjs/swagger';

import { User } from '../entities/user.entity';

export class UserResponseDto {
    @ApiProperty({
        example: 1,
        description: 'Identificador do usuário',
    })
    id: number;

    @ApiProperty({
        example: 'João Silva',
    })
    name: string;

    @ApiProperty({
        example: 'joao@email.com',
    })
    email: string;

    @ApiProperty({
        example: '000001',
    })
    registration: string;

    @ApiProperty({
        example: '2026-09-01T12:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2026-09-01T12:30:00.000Z',
    })
    updatedAt: Date;

    static fromEntity(
        user: User,
    ): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            registration: user.registration,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}