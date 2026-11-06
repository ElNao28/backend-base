import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDto } from './dto/requests/register-user.dto.js';
import { SignInDto } from './dto/requests/sign-in.dto.js';
import { SignInDataResponseDto } from './dto/responses/sign-in-response.dto.js';
import { Public } from './decorators/public.decorator.js';
import { Authorization, Roles } from './decorators/authorization.decorator.js';
import { UserJwt } from './decorators/user.decorator.js';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { RegenerateRefreshTokenResponseDto } from './dto/responses/regenerate-access-token-response.dto.js';
import { RefreshRoute } from './decorators/refresh-route.decorator.js';
import { ResponseDataApi } from '../common/decorators/response-api.decorator.js';
import { ResponseEmptyApi } from '../common/decorators/response-success-api.decorators.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseEmptyApi(HttpStatus.CREATED)
  @Public()
  @Post('register')
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @ResponseDataApi(SignInDataResponseDto)
  @Public()
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ResponseDataApi(RegenerateRefreshTokenResponseDto)
  @Authorization(Roles.ADMIN, Roles.SUPER_ADMIN, Roles.USER)
  @RefreshRoute()
  @UseGuards(RefreshTokenGuard)
  @Post('access-token')
  public regenerateAccessToken(@UserJwt() userJwtDto: UserJwtDto) {
    return this.authService.regenerateAccessToken(userJwtDto);
  }
}
