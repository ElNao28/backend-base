import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  Authorization,
  Roles,
} from '../auth/decorators/authorization.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { UserJwt } from '../auth/decorators/user.decorator.js';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';
import { ResponseApi } from '../auth/decorators/response-api.decorator.js';
import { UserDto } from './dto/responses/user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseApi(UserDto, {
    isArray: true,
    isPagination: true,
  })
  @Authorization(Roles.SUPER_ADMIN)
  @Get('all')
  public getUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getAllUsers(paginationDto);
  }

  @ResponseApi(UserDto)
  @Authorization(Roles.USER, Roles.SUPER_ADMIN, Roles.ADMIN)
  @Get('me')
  public getUser(@UserJwt() userJwtDto: UserJwtDto) {
    return this.usersService.getUser(userJwtDto);
  }

  @ResponseApi(UserDto)
  @Authorization(Roles.SUPER_ADMIN, Roles.ADMIN)
  @Get('user/:id')
  public getUserById(@Param('id', ParseUUIDPipe) idUser: string) {
    return this.usersService.getUserById(idUser);
  }
}
