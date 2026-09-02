import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { FindUsersQueryDto } from './find-users-query.dto';

describe('FindUsersQueryDto', () => {
    const validateDto = async (data: Record<string, unknown>) => {
        const dto = plainToInstance(FindUsersQueryDto, data);

        const errors = await validate(dto);

        return {
            dto,
            errors,
        };
    };

    it('deve utilizar página 1 e limite 15 por padrão', async () => {
        const { dto, errors } = await validateDto({});

        expect(errors).toHaveLength(0);
        expect(dto.page).toBe(1);
        expect(dto.limit).toBe(15);
    });

    it('deve converter page e limit recebidos como string para número', async () => {
        const { dto, errors } = await validateDto({
            page: '2',
            limit: '30',
        });

        expect(errors).toHaveLength(0);
        expect(dto.page).toBe(2);
        expect(dto.limit).toBe(30);
    });

    it('deve rejeitar página menor que 1', async () => {
        const { errors } = await validateDto({
            page: '0',
        });

        expect(
            errors.some((error) => error.property === 'page'),
        ).toBe(true);
    });

    it('deve rejeitar limite maior que 100', async () => {
        const { errors } = await validateDto({
            limit: '101',
        });

        expect(
            errors.some((error) => error.property === 'limit'),
        ).toBe(true);
    });

    it('deve rejeitar valores não numéricos na paginação', async () => {
        const { errors } = await validateDto({
            page: 'abc',
            limit: 'xyz',
        });

        expect(
            errors.some((error) => error.property === 'page'),
        ).toBe(true);

        expect(
            errors.some((error) => error.property === 'limit'),
        ).toBe(true);
    });

    it('deve remover espaços extras do nome pesquisado', async () => {
        const { dto, errors } = await validateDto({
            name: '   João Silva   ',
        });

        expect(errors).toHaveLength(0);
        expect(dto.name).toBe('João Silva');
    });

    it('deve considerar pesquisa vazia como não informada', async () => {
        const { dto, errors } = await validateDto({
            name: '   ',
        });

        expect(errors).toHaveLength(0);
        expect(dto.name).toBeUndefined();
    });
});