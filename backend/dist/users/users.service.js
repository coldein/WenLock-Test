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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt_1 = require("bcrypt");
const typeorm_2 = require("typeorm");
const user_response_dto_1 = require("./dto/user-response.dto");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    static { UsersService_1 = this; }
    usersRepository;
    static PASSWORD_SALT_ROUNDS = 10;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
                { registration: createUserDto.registration },
            ],
        });
        if (existingUser) {
            if (existingUser.email === createUserDto.email) {
                throw new common_1.ConflictException('E-mail já cadastrado');
            }
            throw new common_1.ConflictException('Matrícula já cadastrada');
        }
        const passwordHash = await (0, bcrypt_1.hash)(createUserDto.password, UsersService_1.PASSWORD_SALT_ROUNDS);
        const user = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            registration: createUserDto.registration,
            passwordHash,
        });
        try {
            const savedUser = await this.usersRepository.save(user);
            return user_response_dto_1.UserResponseDto.fromEntity(savedUser);
        }
        catch (error) {
            if (this.isDuplicateEntryError(error)) {
                throw new common_1.ConflictException('E-mail ou matrícula já cadastrados');
            }
            throw error;
        }
    }
    async findAll(query) {
        const { page, limit, name } = query;
        const queryBuilder = this.usersRepository
            .createQueryBuilder('user');
        if (name) {
            queryBuilder.where('user.name LIKE :name', {
                name: `%${name}%`,
            });
        }
        queryBuilder
            .orderBy('user.name', 'ASC')
            .addOrderBy('user.id', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [users, totalItems] = await queryBuilder.getManyAndCount();
        return {
            data: users.map((user) => user_response_dto_1.UserResponseDto.fromEntity(user)),
            meta: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return user_response_dto_1.UserResponseDto.fromEntity(user);
    }
    isDuplicateEntryError(error) {
        if (!(error instanceof typeorm_2.QueryFailedError)) {
            return false;
        }
        const driverError = error.driverError;
        return driverError?.code === 'ER_DUP_ENTRY';
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map