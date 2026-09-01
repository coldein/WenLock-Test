import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
} from 'class-validator';
import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: 'João Santos',
        description: 'Novo nome do usuário',
        maxLength: 150,
    })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(150)
    @Matches(/^[\p{L}\s]+$/u, {
        message: 'O nome deve conter apenas letras e espaços',
    })
    name?: string;

    @ApiPropertyOptional({
        example: 'joao.santos@email.com',
        description: 'Novo e-mail do usuário',
        maxLength: 254,
    })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim().toLowerCase()
            : value,
    )
    @IsEmail(
        {},
        {
            message: 'O e-mail informado é inválido',
        },
    )
    @MaxLength(254)
    email?: string;

    @ApiPropertyOptional({
        example: '000002',
        description: 'Nova matrícula numérica do usuário',
        maxLength: 20,
    })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @MaxLength(20)
    @Matches(/^\d+$/, {
        message: 'A matrícula deve conter apenas números',
    })
    registration?: string;

    @ApiPropertyOptional({
        example: 'xyz123',
        description:
            'Nova senha alfanumérica com exatamente 6 caracteres',
        minLength: 6,
        maxLength: 6,
    })
    @IsOptional()
    @IsString()
    @Length(6, 6, {
        message:
            'A senha deve possuir exatamente 6 caracteres',
    })
    @Matches(/^[A-Za-z0-9]+$/, {
        message:
            'A senha deve conter apenas letras e números',
    })
    password?: string;
}