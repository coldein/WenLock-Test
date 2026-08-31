import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    private static readonly PASSWORD_SALT_ROUNDS;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(query: FindUsersQueryDto): Promise<PaginatedUsersResponseDto>;
    private isDuplicateEntryError;
}
