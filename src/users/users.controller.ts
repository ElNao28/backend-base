import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  Authorization,
  Roles,
} from '../auth/decorators/authorization.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { UserJwt } from '../auth/decorators/user.decorator.js';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';
import { UserDto } from './dto/responses/user.dto.js';
import { UpdateUserDto } from './dto/requests/update-user.dto.js';
import { ResponseDataApi } from '../common/decorators/response-api.decorator.js';
import { ResponseEmptyApi } from '../common/decorators/response-success-api.decorators.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseDataApi(UserDto, {
    isArray: true,
    isPagination: true,
  })
  @Authorization(Roles.SUPER_ADMIN)
  @Get('all')
  public getUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getAllUsers(paginationDto);
  }

  @ResponseDataApi(UserDto)
  @Authorization(Roles.ALL)
  @Get('me')
  public getUser(@UserJwt() userJwtDto: UserJwtDto) {
    return this.usersService.getUser(userJwtDto);
  }

  @ResponseDataApi(UserDto)
  @Authorization(Roles.SUPER_ADMIN, Roles.ADMIN)
  @Get('user/:id')
  public getUserById(@Param('id', ParseUUIDPipe) idUser: string) {
    return this.usersService.getUserById(idUser);
  }

  @ResponseEmptyApi()
  @Authorization(Roles.ALL)
  @Patch('update')
  public updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @UserJwt() userJwt: UserJwtDto,
  ) {
    return this.usersService.updateUser(updateUserDto, userJwt);
  }

  @ResponseEmptyApi()
  @Authorization(Roles.SUPER_ADMIN)
  @Delete('user/:id')
  public deleteUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
