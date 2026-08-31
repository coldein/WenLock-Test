"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
class UserResponseDto {
    id;
    name;
    email;
    registration;
    createdAt;
    updatedAt;
    static fromEntity(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            registration: user.registration,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=user-response.dto.js.map