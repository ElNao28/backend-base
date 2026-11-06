import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDto } from './dto/requests/register-user.dto.js';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '../common/dto/success-response.dto.js';
import { SignInDto } from './dto/requests/sign-in.dto.js';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Authorization, Roles } from './decorators/authorization.decorator.js';
import { UserJwt } from './decorators/user.decorator.js';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { RegenerateRefreshTokenResponseDto } from './dto/responses/regenerate-access-token-response.dto.js';
import { RefreshRoute } from './decorators/refresh-route.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiOkResponse({
    type: SignInResponseDto,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOkResponse({
    type: RegenerateRefreshTokenResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Authorization(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.USER)
  @RefreshRoute()
  @UseGuards(RefreshTokenGuard)
  @Post('access-token')
  public regenerateAccessToken(@UserJwt() userJwtDto: UserJwtDto) {
    return this.authService.regenerateAccessToken(userJwtDto);
  }
}
