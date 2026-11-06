import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity.js';
import { Repository } from 'typeorm';
import {
  HandlerSuccessResponse,
  PaginationData,
} from '../common/utils/handler-success-response.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

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
}
