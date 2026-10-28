import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { cwd } from 'process';

export default new DataSource({
  type: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  entities: [join(cwd(), 'src/**/*.entity{.js,.ts}')],
  migrations: [join(cwd(), 'database/migrations/*{.js,.ts}')],
});
