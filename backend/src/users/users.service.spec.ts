import {
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('UsersService', () => {
    let service: UsersService;

    const queryBuilderMock = {
        where: jest.fn(),
        orderBy: jest.fn(),
        addOrderBy: jest.fn(),
        skip: jest.fn(),
        take: jest.fn(),
        getManyAndCount: jest.fn(),
    };

    const usersRepositoryMock = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const hashMock = hash as jest.Mock;

    const createUserDto: CreateUserDto = {
        name: 'João Silva',
        email: 'joao@email.com',
        registration: '000001',
        password: 'abc123',
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        queryBuilderMock.where.mockReturnValue(queryBuilderMock);
        queryBuilderMock.orderBy.mockReturnValue(queryBuilderMock);
        queryBuilderMock.addOrderBy.mockReturnValue(queryBuilderMock);
        queryBuilderMock.skip.mockReturnValue(queryBuilderMock);
        queryBuilderMock.take.mockReturnValue(queryBuilderMock);

        usersRepositoryMock.createQueryBuilder.mockReturnValue(
            queryBuilderMock,
        );

        const module: TestingModule =
            await Test.createTestingModule({
                providers: [
                    UsersService,
                    {
                        provide: getRepositoryToken(User),
                        useValue: usersRepositoryMock,
                    },
                ],
            }).compile();

        service = module.get<UsersService>(UsersService);
    });

    // =========================================================
    // CADASTRO DE USUÁRIOS
    // =========================================================

    it('deve cadastrar um usuário com a senha criptografada', async () => {
        usersRepositoryMock.findOne.mockResolvedValue(null);

        hashMock.mockResolvedValue('senha-hash');

        usersRepositoryMock.create.mockImplementation((data) => ({
            ...data,
        }));

        const savedUser = {
            id: 1,
            name: createUserDto.name,
            email: createUserDto.email,
            registration: createUserDto.registration,
            passwordHash: 'senha-hash',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        usersRepositoryMock.save.mockResolvedValue(savedUser);

        const result = await service.create(createUserDto);

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenCalledWith({
            where: [
                { email: createUserDto.email },
                { registration: createUserDto.registration },
            ],
        });

        expect(hashMock).toHaveBeenCalledWith(
            createUserDto.password,
            10,
        );

        expect(
            usersRepositoryMock.create,
        ).toHaveBeenCalledWith({
            name: createUserDto.name,
            email: createUserDto.email,
            registration: createUserDto.registration,
            passwordHash: 'senha-hash',
        });

        expect(usersRepositoryMock.save).toHaveBeenCalled();

        expect(result).toEqual({
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            registration: savedUser.registration,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        });

        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('passwordHash');
    });

    it('deve rejeitar cadastro quando o e-mail já estiver cadastrado', async () => {
        usersRepositoryMock.findOne.mockResolvedValue({
            id: 1,
            email: createUserDto.email,
            registration: '999999',
        });

        await expect(
            service.create(createUserDto),
        ).rejects.toThrow(
            new ConflictException('E-mail já cadastrado'),
        );

        expect(hashMock).not.toHaveBeenCalled();
        expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('deve rejeitar cadastro quando a matrícula já estiver cadastrada', async () => {
        usersRepositoryMock.findOne.mockResolvedValue({
            id: 1,
            email: 'outro@email.com',
            registration: createUserDto.registration,
        });

        await expect(
            service.create(createUserDto),
        ).rejects.toThrow(
            new ConflictException('Matrícula já cadastrada'),
        );

        expect(hashMock).not.toHaveBeenCalled();
        expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    });

    // =========================================================
    // LISTAGEM DE USUÁRIOS
    // =========================================================

    it('deve retornar usuários paginados', async () => {
        const users = [
            {
                id: 1,
                name: 'Ana Silva',
                email: 'ana@email.com',
                registration: '000001',
                passwordHash: 'hash-1',
                createdAt: new Date('2026-08-31T10:00:00'),
                updatedAt: new Date('2026-08-31T10:00:00'),
            },
            {
                id: 2,
                name: 'Bruno Souza',
                email: 'bruno@email.com',
                registration: '000002',
                passwordHash: 'hash-2',
                createdAt: new Date('2026-08-31T10:00:00'),
                updatedAt: new Date('2026-08-31T10:00:00'),
            },
        ];

        queryBuilderMock.getManyAndCount.mockResolvedValue([
            users,
            32,
        ]);

        const result = await service.findAll({
            page: 2,
            limit: 15,
        });

        expect(
            usersRepositoryMock.createQueryBuilder,
        ).toHaveBeenCalledWith('user');

        expect(
            queryBuilderMock.skip,
        ).toHaveBeenCalledWith(15);

        expect(
            queryBuilderMock.take,
        ).toHaveBeenCalledWith(15);

        expect(result.meta).toEqual({
            page: 2,
            limit: 15,
            totalItems: 32,
            totalPages: 3,
        });

        expect(result.data).toHaveLength(2);
    });

    it('deve aplicar pesquisa parcial por nome', async () => {
        queryBuilderMock.getManyAndCount.mockResolvedValue([
            [],
            0,
        ]);

        await service.findAll({
            page: 1,
            limit: 15,
            name: 'João',
        });

        expect(
            queryBuilderMock.where,
        ).toHaveBeenCalledWith(
            'user.name LIKE :name',
            {
                name: '%João%',
            },
        );
    });

    it('não deve aplicar filtro de nome quando a pesquisa não for informada', async () => {
        queryBuilderMock.getManyAndCount.mockResolvedValue([
            [],
            0,
        ]);

        await service.findAll({
            page: 1,
            limit: 15,
        });

        expect(
            queryBuilderMock.where,
        ).not.toHaveBeenCalled();
    });

    it('deve ordenar usuários por nome e id', async () => {
        queryBuilderMock.getManyAndCount.mockResolvedValue([
            [],
            0,
        ]);

        await service.findAll({
            page: 1,
            limit: 15,
        });

        expect(
            queryBuilderMock.orderBy,
        ).toHaveBeenCalledWith(
            'user.name',
            'ASC',
        );

        expect(
            queryBuilderMock.addOrderBy,
        ).toHaveBeenCalledWith(
            'user.id',
            'ASC',
        );
    });

    it('deve retornar estrutura paginada vazia quando não houver usuários', async () => {
        queryBuilderMock.getManyAndCount.mockResolvedValue([
            [],
            0,
        ]);

        const result = await service.findAll({
            page: 1,
            limit: 15,
        });

        expect(result).toEqual({
            data: [],
            meta: {
                page: 1,
                limit: 15,
                totalItems: 0,
                totalPages: 0,
            },
        });
    });

    it('não deve expor o hash da senha na listagem', async () => {
        const user = {
            id: 1,
            name: 'Ana Silva',
            email: 'ana@email.com',
            registration: '000001',
            passwordHash: 'hash-super-secreto',
            createdAt: new Date('2026-08-31T10:00:00'),
            updatedAt: new Date('2026-08-31T10:00:00'),
        };

        queryBuilderMock.getManyAndCount.mockResolvedValue([
            [user],
            1,
        ]);

        const result = await service.findAll({
            page: 1,
            limit: 15,
        });

        expect(result.data).toHaveLength(1);

        expect(
            result.data[0],
        ).not.toHaveProperty('password');

        expect(
            result.data[0],
        ).not.toHaveProperty('passwordHash');
    });

    // =========================================================
    // CONSULTA DE USUÁRIO POR ID
    // =========================================================

    it('deve retornar um usuário pelo id', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash-super-secreto',
            createdAt: new Date('2026-08-31T10:00:00'),
            updatedAt: new Date('2026-08-31T10:00:00'),
        };

        usersRepositoryMock.findOne.mockResolvedValue(user);

        const result = await service.findOne(1);

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        });

        expect(result).toEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            registration: user.registration,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    });

    it('deve lançar NotFoundException quando o usuário não existir', async () => {
        usersRepositoryMock.findOne.mockResolvedValue(null);

        await expect(
            service.findOne(999),
        ).rejects.toThrow(
            new NotFoundException(
                'Usuário não encontrado',
            ),
        );

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenCalledWith({
            where: {
                id: 999,
            },
        });
    });

    it('não deve expor o hash da senha na consulta por id', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash-super-secreto',
            createdAt: new Date('2026-08-31T10:00:00'),
            updatedAt: new Date('2026-08-31T10:00:00'),
        };

        usersRepositoryMock.findOne.mockResolvedValue(user);

        const result = await service.findOne(1);

        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('passwordHash');
    });

    // =========================================================
    // ATUALIZAÇÃO DE USUÁRIOS
    // =========================================================

    it('deve atualizar parcialmente um usuário', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash-atual',
            createdAt: new Date('2026-08-31T10:00:00'),
            updatedAt: new Date('2026-08-31T10:00:00'),
        };

        usersRepositoryMock.findOne.mockResolvedValue(user);

        usersRepositoryMock.save.mockImplementation(
            async (updatedUser) => updatedUser,
        );

        const result = await service.update(1, {
            name: 'João Santos',
        });

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
        });

        expect(
            usersRepositoryMock.save,
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                name: 'João Santos',
                email: 'joao@email.com',
                registration: '000001',
            }),
        );

        expect(result.name).toBe('João Santos');

        expect(hashMock).not.toHaveBeenCalled();

        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('passwordHash');
    });

    it('deve lançar NotFoundException ao atualizar usuário inexistente', async () => {
        usersRepositoryMock.findOne.mockResolvedValue(null);

        await expect(
            service.update(999, {
                name: 'Usuário Teste',
            }),
        ).rejects.toThrow(
            new NotFoundException(
                'Usuário não encontrado',
            ),
        );

        expect(
            usersRepositoryMock.save,
        ).not.toHaveBeenCalled();
    });

    it('deve rejeitar atualização quando o novo e-mail já estiver cadastrado', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const existingUser = {
            id: 2,
            name: 'Maria Silva',
            email: 'maria@email.com',
            registration: '000002',
        };

        usersRepositoryMock.findOne
            .mockResolvedValueOnce(user)
            .mockResolvedValueOnce(existingUser);

        await expect(
            service.update(1, {
                email: 'maria@email.com',
            }),
        ).rejects.toThrow(
            new ConflictException(
                'E-mail já cadastrado',
            ),
        );

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenNthCalledWith(
            2,
            {
                where: {
                    email: 'maria@email.com',
                },
            },
        );

        expect(
            usersRepositoryMock.save,
        ).not.toHaveBeenCalled();
    });

    it('deve rejeitar atualização quando a nova matrícula já estiver cadastrada', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const existingUser = {
            id: 2,
            name: 'Maria Silva',
            email: 'maria@email.com',
            registration: '000002',
        };

        usersRepositoryMock.findOne
            .mockResolvedValueOnce(user)
            .mockResolvedValueOnce(existingUser);

        await expect(
            service.update(1, {
                registration: '000002',
            }),
        ).rejects.toThrow(
            new ConflictException(
                'Matrícula já cadastrada',
            ),
        );

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenNthCalledWith(
            2,
            {
                where: {
                    registration: '000002',
                },
            },
        );

        expect(
            usersRepositoryMock.save,
        ).not.toHaveBeenCalled();
    });

    it('não deve verificar duplicidade quando o e-mail não for alterado', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        usersRepositoryMock.findOne.mockResolvedValue(user);

        usersRepositoryMock.save.mockImplementation(
            async (updatedUser) => updatedUser,
        );

        await service.update(1, {
            email: 'joao@email.com',
        });

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenCalledTimes(1);

        expect(
            usersRepositoryMock.save,
        ).toHaveBeenCalled();
    });

    it('não deve verificar duplicidade quando a matrícula não for alterada', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        usersRepositoryMock.findOne.mockResolvedValue(user);

        usersRepositoryMock.save.mockImplementation(
            async (updatedUser) => updatedUser,
        );

        await service.update(1, {
            registration: '000001',
        });

        expect(
            usersRepositoryMock.findOne,
        ).toHaveBeenCalledTimes(1);

        expect(
            usersRepositoryMock.save,
        ).toHaveBeenCalled();
    });

    it('deve gerar novo hash quando a senha for atualizada', async () => {
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            registration: '000001',
            passwordHash: 'hash-antigo',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        usersRepositoryMock.findOne.mockResolvedValue(user);

        hashMock.mockResolvedValue('hash-novo');

        usersRepositoryMock.save.mockImplementation(
            async (updatedUser) => updatedUser,
        );

        const result = await service.update(1, {
            password: 'xyz123',
        });

        expect(hashMock).toHaveBeenCalledWith(
            'xyz123',
            10,
        );

        expect(
            usersRepositoryMock.save,
        ).toHaveBeenCalledWith(
            expect.objectContaining({
                passwordHash: 'hash-novo',
            }),
        );

        expect(result).not.toHaveProperty('password');
        expect(result).not.toHaveProperty('passwordHash');
    });

    // =========================================================
    // EXCLUSÃO DE USUÁRIOS
    // =========================================================

    it('deve excluir um usuário existente', async () => {
        usersRepositoryMock.delete.mockResolvedValue({
            affected: 1,
            raw: [],
        });

        await expect(
            service.remove(1),
        ).resolves.toBeUndefined();

        expect(
            usersRepositoryMock.delete,
        ).toHaveBeenCalledWith(1);

        expect(
            usersRepositoryMock.delete,
        ).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException ao excluir usuário inexistente', async () => {
        usersRepositoryMock.delete.mockResolvedValue({
            affected: 0,
            raw: [],
        });

        await expect(
            service.remove(999),
        ).rejects.toThrow(
            new NotFoundException(
                'Usuário não encontrado',
            ),
        );

        expect(
            usersRepositoryMock.delete,
        ).toHaveBeenCalledWith(999);

        expect(
            usersRepositoryMock.delete,
        ).toHaveBeenCalledTimes(1);
    });
});