import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { BcryptConfigService } from '../common/services/bcrypt.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { DataSource, Repository } from 'typeorm';
import { Credentials } from './entities/credentials.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { Rol } from './entities/rol.entity.js';
import { handleDatabaseErrors } from '../common/utils/handler-db-errors.js';
import { HandlerSuccessResponse } from '../common/utils/handler-success-response.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptConfigService: BcryptConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private dataSource: DataSource,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const { password, email, phone, ...rest } = registerUserDto;

    const existEmail = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (existEmail) throw new BadRequestException('Email already exist');

    const existPhone = await this.userRepository.findOne({
      where: {
        phone,
      },
    });
    if (existPhone) throw new BadRequestException('phone already exist');

    const passwordHash = await this.bcryptConfigService.hash(password);

    const defaultUserRol = await this.rolRepository.findOne({
      where: {
        id: 3,
      },
    });

    if (!defaultUserRol) throw new BadRequestException('Rol not exit');

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.startTransaction();
      const newUser = queryRunner.manager.create(User, {
        email,
        phone,
        ...rest,
        roles: [defaultUserRol],
      });

      const userSaved = await queryRunner.manager.save(newUser);

      const userCredentials = this.credentialsRepository.create({
        password: passwordHash,
        user: userSaved,
      });

      await queryRunner.manager.save(userCredentials);
      await queryRunner.commitTransaction();

      return HandlerSuccessResponse.response(
        'User created',
        HttpStatus.CREATED,
        userSaved,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleDatabaseErrors(error);
    } finally {
      await queryRunner.release();
    }
  }
}
