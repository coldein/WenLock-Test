import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';

config({
  path:
    process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env',
});

export default new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [User],

  migrations: [
    'src/database/migrations/*{.ts,.js}',
  ],

  synchronize: false,
});