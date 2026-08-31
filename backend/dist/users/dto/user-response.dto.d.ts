import { User } from '../entities/user.entity';
export declare class UserResponseDto {
    id: number;
    name: string;
    email: string;
    registration: string;
    createdAt: Date;
    updatedAt: Date;
    static fromEntity(user: User): UserResponseDto;
}
