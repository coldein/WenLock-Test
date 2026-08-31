import { Transform, Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class FindUsersQueryDto {
    @Type(() => Number)
    @IsInt({ message: 'A página deve ser um número inteiro' })
    @Min(1, { message: 'A página deve ser maior ou igual a 1' })
    page: number = 1;

    @Type(() => Number)
    @IsInt({ message: 'O limite deve ser um número inteiro' })
    @Min(1, { message: 'O limite deve ser maior ou igual a 1' })
    @Max(100, { message: 'O limite deve ser menor ou igual a 100' })
    limit: number = 15;

    @Transform(({ value }) => {
        if (typeof value !== 'string') {
            return value;
        }

        const trimmedValue = value.trim();

        return trimmedValue === '' ? undefined : trimmedValue;
    })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    name?: string;
}