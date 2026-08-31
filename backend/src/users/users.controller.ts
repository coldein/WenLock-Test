import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post()
    create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }
}