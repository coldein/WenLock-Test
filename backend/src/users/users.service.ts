import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import {
  QueryFailedError,
  Repository,
} from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private static readonly PASSWORD_SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

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

  private isDuplicateEntryError(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError as {
      code?: string;
    };

    return driverError?.code === 'ER_DUP_ENTRY';
  }
}