import { User } from '../entities/user.entity';

export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    registration: string;
    createdAt: Date;
    updatedAt: Date;

    static fromEntity(user: User): UserResponseDto {
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