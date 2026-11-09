import 'dotenv/config.js';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './common/config/typeorm.config.js';
import { JwtModule } from '@nestjs/jwt';
import { OutboxModule, OutboxStorage } from '@nestjs/outbox';

// Envitoment configuration
import generalConfig, {
  EnviromentsValidationSchema,
} from './common/config/envs.config.js';
import { UsersModule } from './users/users.module.js';
import { MailerModule } from './mail/mail.module.js';
import { OutBoxStorageProvider } from './common/providers/outbox-storage.provider.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [generalConfig],
      validationSchema: EnviromentsValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        TypeOrmConfig(configService),
    }),
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('envs.JWT_KEY'),
        global: true,
      }),
    }),
    UsersModule,
    MailerModule,
    OutboxModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        relay: { pollInterval: '1s' },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [OutBoxStorageProvider],
})
export class AppModule {}
