import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'João Silva',
        description: 'Nome completo do usuário',
        maxLength: 150,
    })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @Matches(/^[\p{L}\s]+$/u, {
        message: 'O nome deve conter apenas letras e espaços',
    })
    name: string;

    @ApiProperty({
        example: 'joao@email.com',
        description: 'E-mail do usuário',
        maxLength: 254,
    })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsEmail(
        {},
        {
            message: 'O e-mail informado é inválido',
        },
    )
    @MaxLength(254)
    email: string;

    @ApiProperty({
        example: '000001',
        description:
            'Matrícula numérica do usuário. Armazenada como texto para preservar zeros à esquerda.',
        maxLength: 20,
    })
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @Matches(/^\d+$/, {
        message: 'A matrícula deve conter apenas números',
    })
    registration: string;

    @ApiProperty({
        example: 'abc123',
        description:
            'Senha alfanumérica com exatamente 6 caracteres',
        minLength: 6,
        maxLength: 6,
    })
    @IsString()
    @Length(6, 6, {
        message:
            'A senha deve possuir exatamente 6 caracteres',
    })
    @Matches(/^[A-Za-z0-9]+$/, {
        message:
            'A senha deve conter apenas letras e números',
    })
    password: string;
}