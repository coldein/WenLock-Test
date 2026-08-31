import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    MaxLength,
} from 'class-validator';

export class CreateUserDto {
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

    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value,
    )
    @IsEmail({}, {
        message: 'O e-mail informado é inválido',
    })
    @MaxLength(254)
    email: string;

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

    @IsString()
    @Length(6, 6, {
        message: 'A senha deve possuir exatamente 6 caracteres',
    })
    @Matches(/^[A-Za-z0-9]+$/, {
        message: 'A senha deve conter apenas letras e números',
    })
    password: string;
}