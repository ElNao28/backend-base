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
import { PreRegisterDto } from './dto/requests/pre-register.dto.js';
import { RegisterRoute } from './decorators/register-route.decorator.js';
import { RegisterTokenGuard } from './guards/register-token.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseEmptyApi(HttpStatus.CREATED)
  @Public()
  @Post('pre-register')
  public preRegister(@Body() preRegisterDto: PreRegisterDto) {
    return this.authService.preRegister(preRegisterDto);
  }

  @ResponseDataApi(SignInDataResponseDto)
  @Public()
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ResponseDataApi(RegenerateRefreshTokenResponseDto)
  @Authorization(Roles.ALL)
  @RefreshRoute()
  @UseGuards(RefreshTokenGuard)
  @Post('access-token')
  public regenerateAccessToken(@UserJwt() userJwtDto: UserJwtDto) {
    return this.authService.regenerateAccessToken(userJwtDto);
  }

  @ResponseEmptyApi()
  @RegisterRoute()
  @UseGuards(RegisterTokenGuard)
  @Post('complete-register')
  public completeRegister(
    @Body() registerUserDto: RegisterUserDto,
    @UserJwt() { jti }: { jti: string },
  ) {
    return this.authService.completeRegister(registerUserDto, jti);
  }
}
