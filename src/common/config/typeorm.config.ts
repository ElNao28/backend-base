import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } =
    configService.get('envs');

  return {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: true,
  };
};
