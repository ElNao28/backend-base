import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './common/config/typeorm.config.js';
import { JwtModule } from '@nestjs/jwt';

// Envitoment configuration
import generalConfig, {
  EnviromentsValidationSchema,
} from './common/config/envs.config.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [generalConfig],
      validationSchema: EnviromentsValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        TypeOrmConfig(configService),
    }),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('envs.JWT_KEY'),
        global: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
