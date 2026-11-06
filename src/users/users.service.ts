import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity.js';
import { Repository } from 'typeorm';
import {
  HandlerSuccessResponse,
  PaginationData,
} from '../common/utils/handler-success-response.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getAllUsers(paginationDto: PaginationDto) {
    const { limit, offset, orderBy } = paginationDto;
    const [users, total] = await this.userRepository.findAndCount({
      where: {
        status: true,
      },
      take: limit,
      order: {
        createdAt: orderBy,
      },
      skip: (offset - 1) * limit,
      relations: {
        roles: true,
      },
    });

    const paginationData: PaginationData = {
      currentPage: offset,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    };

    return HandlerSuccessResponse.response(
      'All users',
      HttpStatus.OK,
      users,
      paginationData,
    );
  }

  public async getUser(userJwtDto: UserJwtDto) {
    const { sub: id } = userJwtDto;
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
        status: true,
      },
      relations: {
        roles: true,
      },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    return HandlerSuccessResponse.response(
      'User found',
      HttpStatus.OK,
      foundUser,
    );
  }
}
