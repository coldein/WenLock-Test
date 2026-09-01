"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
(0, dotenv_1.config)({
    path: process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env',
});
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.User],
    migrations: [
        'src/database/migrations/*{.ts,.js}',
    ],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map