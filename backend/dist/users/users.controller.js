"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./dto/create-user.dto");
const find_users_query_dto_1 = require("./dto/find-users-query.dto");
const paginated_users_response_dto_1 = require("./dto/paginated-users-response.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(query) {
        return this.usersService.findAll(query);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Cadastrar usuário',
        description: 'Realiza o cadastro de um novo usuário no sistema.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Usuário cadastrado com sucesso',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Dados informados são inválidos',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'E-mail ou matrícula já cadastrados',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar usuários',
        description: 'Retorna usuários de forma paginada e permite pesquisa parcial pelo nome.',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuários encontrados com sucesso',
        type: paginated_users_response_dto_1.PaginatedUsersResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Parâmetros de paginação ou pesquisa inválidos',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_users_query_dto_1.FindUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Consultar usuário por ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 1,
        description: 'Identificador do usuário',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuário encontrado',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'ID informado é inválido',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Usuário não encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualizar usuário',
        description: 'Atualiza parcialmente os dados de um usuário.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 1,
        description: 'Identificador do usuário',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuário atualizado com sucesso',
        type: user_response_dto_1.UserResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'ID ou dados da atualização são inválidos',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Usuário não encontrado',
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: 'E-mail ou matrícula já pertencem a outro usuário',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Excluir usuário',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 1,
        description: 'Identificador do usuário',
    }),
    (0, swagger_1.ApiNoContentResponse)({
        description: 'Usuário excluído com sucesso',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'ID informado é inválido',
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Usuário não encontrado',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Usuários'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map