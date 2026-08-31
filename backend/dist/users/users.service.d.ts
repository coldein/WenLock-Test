import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    private static readonly PASSWORD_SALT_ROUNDS;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    private isDuplicateEntryError;
}
