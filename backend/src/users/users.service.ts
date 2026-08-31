import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import {
  QueryFailedError,
  Repository,
} from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private static readonly PASSWORD_SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { registration: createUserDto.registration },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('E-mail já cadastrado');
      }

      throw new ConflictException('Matrícula já cadastrada');
    }

    const passwordHash = await hash(
      createUserDto.password,
      UsersService.PASSWORD_SALT_ROUNDS,
    );

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      registration: createUserDto.registration,
      passwordHash,
    });

    try {
      const savedUser = await this.usersRepository.save(user);

      return UserResponseDto.fromEntity(savedUser);
    } catch (error: unknown) {
      if (this.isDuplicateEntryError(error)) {
        throw new ConflictException(
          'E-mail ou matrícula já cadastrados',
        );
      }

      throw error;
    }
  }

  async findAll(
    query: FindUsersQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    const { page, limit, name } = query;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user');

    if (name) {
      queryBuilder.where(
        'user.name LIKE :name',
        {
          name: `%${name}%`,
        },
      );
    }

    queryBuilder
      .orderBy('user.name', 'ASC')
      .addOrderBy('user.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, totalItems] =
      await queryBuilder.getManyAndCount();

    return {
      data: users.map((user) =>
        UserResponseDto.fromEntity(user),
      ),

      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return UserResponseDto.fromEntity(user);
  }

  private isDuplicateEntryError(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError as {
      code?: string;
    };

    return driverError?.code === 'ER_DUP_ENTRY';
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    if (
      updateUserDto.email &&
      updateUserDto.email !== user.email
    ) {
      const userWithSameEmail =
        await this.usersRepository.findOne({
          where: {
            email: updateUserDto.email,
          },
        });

      if (userWithSameEmail) {
        throw new ConflictException(
          'E-mail já cadastrado',
        );
      }
    }

    if (
      updateUserDto.registration &&
      updateUserDto.registration !== user.registration
    ) {
      const userWithSameRegistration =
        await this.usersRepository.findOne({
          where: {
            registration: updateUserDto.registration,
          },
        });

      if (userWithSameRegistration) {
        throw new ConflictException(
          'Matrícula já cadastrada',
        );
      }
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.registration !== undefined) {
      user.registration =
        updateUserDto.registration;
    }

    if (updateUserDto.password !== undefined) {
      user.passwordHash = await hash(
        updateUserDto.password,
        UsersService.PASSWORD_SALT_ROUNDS,
      );
    }

    try {
      const updatedUser =
        await this.usersRepository.save(user);

      return UserResponseDto.fromEntity(
        updatedUser,
      );
    } catch (error: unknown) {
      if (this.isDuplicateEntryError(error)) {
        throw new ConflictException(
          'E-mail ou matrícula já cadastrados',
        );
      }

      throw error;
    }
  }
}