import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Cadastrar usuário',
        description:
            'Realiza o cadastro de um novo usuário no sistema.',
    })
    @ApiCreatedResponse({
        description: 'Usuário cadastrado com sucesso',
        type: UserResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Dados informados são inválidos',
    })
    @ApiConflictResponse({
        description:
            'E-mail ou matrícula já cadastrados',
    })
    create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Listar usuários',
        description:
            'Retorna usuários de forma paginada e permite pesquisa parcial pelo nome.',
    })
    @ApiOkResponse({
        description: 'Usuários encontrados com sucesso',
        type: PaginatedUsersResponseDto,
    })
    @ApiBadRequestResponse({
        description:
            'Parâmetros de paginação ou pesquisa inválidos',
    })
    findAll(
        @Query() query: FindUsersQueryDto,
    ): Promise<PaginatedUsersResponseDto> {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Consultar usuário por ID',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'Identificador do usuário',
    })
    @ApiOkResponse({
        description: 'Usuário encontrado',
        type: UserResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'ID informado é inválido',
    })
    @ApiNotFoundResponse({
        description: 'Usuário não encontrado',
    })
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Atualizar usuário',
        description:
            'Atualiza parcialmente os dados de um usuário.',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'Identificador do usuário',
    })
    @ApiOkResponse({
        description: 'Usuário atualizado com sucesso',
        type: UserResponseDto,
    })
    @ApiBadRequestResponse({
        description:
            'ID ou dados da atualização são inválidos',
    })
    @ApiNotFoundResponse({
        description: 'Usuário não encontrado',
    })
    @ApiConflictResponse({
        description:
            'E-mail ou matrícula já pertencem a outro usuário',
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.update(
            id,
            updateUserDto,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Excluir usuário',
    })
    @ApiParam({
        name: 'id',
        example: 1,
        description: 'Identificador do usuário',
    })
    @ApiNoContentResponse({
        description: 'Usuário excluído com sucesso',
    })
    @ApiBadRequestResponse({
        description: 'ID informado é inválido',
    })
    @ApiNotFoundResponse({
        description: 'Usuário não encontrado',
    })
    remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        return this.usersService.remove(id);
    }
}