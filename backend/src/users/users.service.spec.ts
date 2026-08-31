import { ConflictException } from '@nestjs/common';
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

    const usersRepositoryMock = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const hashMock = hash as jest.Mock;

    const createUserDto: CreateUserDto = {
        name: 'João Silva',
        email: 'joao@email.com',
        registration: '000001',
        password: 'abc123',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: usersRepositoryMock,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);

        jest.clearAllMocks();
    });

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

        expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({
            where: [
                { email: createUserDto.email },
                { registration: createUserDto.registration },
            ],
        });

        expect(hashMock).toHaveBeenCalledWith(
            createUserDto.password,
            10,
        );

        expect(usersRepositoryMock.create).toHaveBeenCalledWith({
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
});