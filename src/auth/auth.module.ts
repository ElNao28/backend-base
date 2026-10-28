import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Rol } from './entities/rol.entity.js';
import { Credentials } from './entities/credentials.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol, Credentials, RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
