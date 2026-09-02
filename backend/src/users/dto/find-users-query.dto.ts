import { Transform, Type } from 'class-transformer';

import {
    IsInt,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersQueryDto {
    @ApiPropertyOptional({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Número da página',
    })
    @Type(() => Number)
    @IsInt({
        message: 'A página deve ser um número inteiro',
    })
    @Min(1, {
        message: 'A página deve ser maior ou igual a 1',
    })
    page: number = 1;

    @ApiPropertyOptional({
        example: 15,
        default: 15,
        minimum: 1,
        maximum: 100,
        description: 'Quantidade de usuários por página',
    })
    @Type(() => Number)
    @IsInt({
        message: 'O limite deve ser um número inteiro',
    })
    @Min(1, {
        message: 'O limite deve ser maior ou igual a 1',
    })
    @Max(100, {
        message: 'O limite deve ser menor ou igual a 100',
    })
    limit: number = 15;

    @ApiPropertyOptional({
        example: 'João',
        description: 'Pesquisa parcial pelo nome do usuário',
        maxLength: 150,
    })
    @Transform(({ value }) => {
        if (typeof value !== 'string') {
            return value;
        }

        const trimmedValue = value.trim();

        return trimmedValue === ''
            ? undefined
            : trimmedValue;
    })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    name?: string;
}