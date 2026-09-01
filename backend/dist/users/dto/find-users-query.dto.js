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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUsersQueryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class FindUsersQueryDto {
    page = 1;
    limit = 15;
    name;
}
exports.FindUsersQueryDto = FindUsersQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 1,
        default: 1,
        minimum: 1,
        description: 'Número da página',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({
        message: 'A página deve ser um número inteiro',
    }),
    (0, class_validator_1.Min)(1, {
        message: 'A página deve ser maior ou igual a 1',
    }),
    __metadata("design:type", Number)
], FindUsersQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 15,
        default: 15,
        minimum: 1,
        maximum: 100,
        description: 'Quantidade de usuários por página',
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({
        message: 'O limite deve ser um número inteiro',
    }),
    (0, class_validator_1.Min)(1, {
        message: 'O limite deve ser maior ou igual a 1',
    }),
    (0, class_validator_1.Max)(100, {
        message: 'O limite deve ser menor ou igual a 100',
    }),
    __metadata("design:type", Number)
], FindUsersQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'João',
        description: 'Pesquisa parcial pelo nome do usuário',
        maxLength: 150,
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string') {
            return value;
        }
        const trimmedValue = value.trim();
        return trimmedValue === ''
            ? undefined
            : trimmedValue;
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], FindUsersQueryDto.prototype, "name", void 0);
//# sourceMappingURL=find-users-query.dto.js.map