import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDto } from './dto/requests/register-user.dto.js';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SuccessResponseDto } from '../common/dto/success-response.dto.js';
import { SignInDto } from './dto/requests/sign-in.dto.js';
import { SignInResponseDto } from './dto/responses/sign-in-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @Post('register')
  public registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiOkResponse({
    type: SignInResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
