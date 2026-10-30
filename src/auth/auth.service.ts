import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/requests/register-user.dto.js';
import { BcryptConfigService } from '../common/services/bcrypt.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { DataSource, Repository } from 'typeorm';
import { Credentials } from './entities/credentials.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { Rol } from './entities/rol.entity.js';
import { handleDatabaseErrors } from '../common/utils/handler-db-errors.js';
import { HandlerSuccessResponse } from '../common/utils/handler-success-response.js';
import { SignInDto } from './dto/requests/sign-in.dto.js';
import { JwtGeneratorService } from '../common/services/jwt-generator.service.js';
import { randomUUID } from 'crypto';

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
    private readonly jwtGeneratorService: JwtGeneratorService,
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
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleDatabaseErrors(error);
    } finally {
      await queryRunner.release();
    }
  }

  public async signIn(signInDto: SignInDto) {
    //* Validate user credentials
    const foundUser = await this.validateUserCredentials(signInDto);

    //* Define the tokens payload
    const { accessTokenPayload, refreshTokenPayload } =
      this.generateSignTokensPayload(foundUser);

    //* Generate tokens
    const accessToken = this.jwtGeneratorService.generateToken(
      accessTokenPayload,
      '15m',
    );
    const refreshToken = this.jwtGeneratorService.generateToken(
      refreshTokenPayload,
      '7d',
    );

    //* Save refresh token on database
    await this.saveRefreshToken(refreshToken, foundUser);
    return HandlerSuccessResponse.response('Welcome', HttpStatus.OK, {
      accessToken,
      refreshToken,
    });
  }

  private async validateUserCredentials(signInDto: SignInDto): Promise<User> {
    const { password, email } = signInDto;
    const foundUser = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: { roles: true },
    });

    if (!foundUser) throw new UnauthorizedException('Incorrect credentials');

    const foundCredentials = await this.credentialsRepository.findOne({
      where: {
        user: {
          id: foundUser.id,
        },
      },
    });

    if (!foundCredentials)
      throw new InternalServerErrorException(
        'An unexpected exception: Not found credentials',
      );

    const isMatch = await this.bcryptConfigService.compare(
      password,
      foundCredentials.password,
    );

    if (!isMatch) throw new UnauthorizedException('Incorrect credentials');

    return foundUser;
  }

  private generateSignTokensPayload(user: User) {
    const { id } = user;
    return {
      accessTokenPayload: {
        sub: id,
      },
      refreshTokenPayload: {
        sub: id,
        jti: randomUUID(),
        tokenType: 'refresh',
      },
    };
  }

  private async saveRefreshToken(
    refreshToken: string,
    user: User,
  ): Promise<void> {
    const { exp, jti } =
      await this.jwtGeneratorService.verifyToken(refreshToken);
    const tokenHash = this.bcryptConfigService.hashSha256(refreshToken);
    const expiresAt = new Date(exp * 1000);
    try {
      const newRefreshToken = this.refreshTokenRepository.create({
        jti,
        tokenHash,
        user,
        expiresAt,
      });

      await this.refreshTokenRepository.save(newRefreshToken);
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }
}
