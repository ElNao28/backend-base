import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  Authorization,
  Roles,
} from '../auth/decorators/authorization.decorator.js';
import { ApiOkResponse } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { GetUsersResponse } from './dto/responses/get-users-response.dto.js';
import { UserJwt } from '../auth/decorators/user.decorator.js';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';
import { UserResponseDto } from './dto/responses/get-user-response.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    type: GetUsersResponse,
  })
  @Authorization(Roles.SUPER_ADMIN)
  @Get('all')
  public getUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getAllUsers(paginationDto);
  }

  @ApiOkResponse({
    type: UserResponseDto,
  })
  @Authorization(Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN)
  @Get('me')
  public getUser(@UserJwt() userJwtDto: UserJwtDto) {
    return this.usersService.getUser(userJwtDto);
  }
}
