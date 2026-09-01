import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(query: FindUsersQueryDto): Promise<PaginatedUsersResponseDto>;
    findOne(id: number): Promise<UserResponseDto>;
    remove(id: number): Promise<void>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
}
