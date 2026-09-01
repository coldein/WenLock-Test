import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
    const validateDto = async (
        data: Partial<UpdateUserDto>,
    ) => {
        const dto = plainToInstance(UpdateUserDto, data);

        return {
            dto,
            errors: await validate(dto),
        };
    };

    it('deve aceitar atualização parcial', async () => {
        const { dto, errors } = await validateDto({
            name: 'João Santos',
        });

        expect(errors).toHaveLength(0);
        expect(dto.name).toBe('João Santos');
    });

    it('deve aceitar objeto vazio por se tratar de atualização parcial', async () => {
        const { errors } = await validateDto({});

        expect(errors).toHaveLength(0);
    });

    it('deve normalizar o e-mail', async () => {
        const { dto, errors } = await validateDto({
            email: '  JOAO@EMAIL.COM  ',
        });

        expect(errors).toHaveLength(0);
        expect(dto.email).toBe('joao@email.com');
    });

    it('deve rejeitar nome contendo números', async () => {
        const { errors } = await validateDto({
            name: 'João123',
        });

        expect(
            errors.some((error) => error.property === 'name'),
        ).toBe(true);
    });

    it('deve rejeitar e-mail inválido', async () => {
        const { errors } = await validateDto({
            email: 'email-invalido',
        });

        expect(
            errors.some((error) => error.property === 'email'),
        ).toBe(true);
    });

    it('deve rejeitar matrícula contendo letras', async () => {
        const { errors } = await validateDto({
            registration: 'ABC123',
        });

        expect(
            errors.some(
                (error) => error.property === 'registration',
            ),
        ).toBe(true);
    });

    it('deve rejeitar senha com quantidade diferente de 6 caracteres', async () => {
        const { errors } = await validateDto({
            password: 'abc12',
        });

        expect(
            errors.some(
                (error) => error.property === 'password',
            ),
        ).toBe(true);
    });

    it('deve rejeitar caracteres especiais na senha', async () => {
        const { errors } = await validateDto({
            password: 'abc12@',
        });

        expect(
            errors.some(
                (error) => error.property === 'password',
            ),
        ).toBe(true);
    });
});