import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Patch,
    Query,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';

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

    @Get()
    findAll(
        @Query() query: FindUsersQueryDto,
    ): Promise<PaginatedUsersResponseDto> {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.update(
            id,
            updateUserDto,
        );
    }
}