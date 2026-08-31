import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
    const validateDto = async (
        data: Partial<CreateUserDto>,
    ) => {
        const dto = plainToInstance(CreateUserDto, data);

        return validate(dto);
    };

    it('deve aceitar um usuário válido', async () => {
        const errors = await validateDto({
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            password: 'abc123',
        });

        expect(errors).toHaveLength(0);
    });

    it('deve aceitar nomes com caracteres acentuados', async () => {
        const errors = await validateDto({
            name: 'Márcia André Luís',
            email: 'marcia@email.com',
            registration: '000002',
            password: 'a1b2c3',
        });

        expect(errors).toHaveLength(0);
    });

    it('deve rejeitar números no nome', async () => {
        const errors = await validateDto({
            name: 'João123',
            email: 'joao@email.com',
            registration: '000001',
            password: 'abc123',
        });

        expect(
            errors.some((error) => error.property === 'name'),
        ).toBe(true);
    });

    it('deve rejeitar um e-mail inválido', async () => {
        const errors = await validateDto({
            name: 'João Silva',
            email: 'email-invalido',
            registration: '000001',
            password: 'abc123',
        });

        expect(
            errors.some((error) => error.property === 'email'),
        ).toBe(true);
    });

    it('deve rejeitar matrícula que contenha letras', async () => {
        const errors = await validateDto({
            name: 'João Silva',
            email: 'joao@email.com',
            registration: 'ABC123',
            password: 'abc123',
        });

        expect(
            errors.some(
                (error) => error.property === 'registration',
            ),
        ).toBe(true);
    });

    it('deve rejeitar senha com mais ou menos de 6 caracteres', async () => {
        const errors = await validateDto({
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            password: 'abc12',
        });

        expect(
            errors.some((error) => error.property === 'password'),
        ).toBe(true);
    });

    it('deve rejeitar caracteres especiais na senha', async () => {
        const errors = await validateDto({
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            password: 'abc12@',
        });

        expect(
            errors.some((error) => error.property === 'password'),
        ).toBe(true);
    });
});