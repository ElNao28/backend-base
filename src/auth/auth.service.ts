import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { BcryptConfigService } from '../common/services/bcrypt.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Credentials } from './entities/credentials.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { Rol } from './entities/rol.entity.js';
import { handleDatabaseErrors } from '../common/utils/handler-db-errors.js';
import { HandlerSuccessResponse } from '../common/utils/handler-success-response.js';
import { SignInDto } from './dto/requests/sign-in.dto.js';
import { JwtGeneratorService } from '../common/services/jwt-generator.service.js';
import { randomUUID } from 'crypto';
import { UserJwtDto } from '../common/dto/jwt-user.dto.js';
import { Jwtypes } from '../common/constants/jwt-types.js';
import { Outbox } from '@nestjs/outbox';
import { PreRegister } from './entities/pre-register.entity.js';
import { PreRegisterDto } from './dto/requests/pre-register.dto.js';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptConfigService: BcryptConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(PreRegister)
    private readonly PreRegisterRepository: Repository<PreRegister>,
    private dataSource: DataSource,
    private readonly jwtGeneratorService: JwtGeneratorService,
    private readonly outbox: Outbox<EntityManager>,
  ) {}

  public async preRegister(preRegisterDto: PreRegisterDto) {
    const { email } = preRegisterDto;

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const manager = queryRunner.manager;

      const existEmail = await manager.findOne(User, {
        where: {
          email,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (existEmail) throw new ConflictException('Email already exists');

      let preRegister = await manager.findOne(PreRegister, {
        where: {
          email,
        },
        lock: { mode: 'pessimistic_write' },
      });

      const isExpired =
        preRegister && preRegister.expiresAt.getTime() <= Date.now();

      if (!preRegister) {
        preRegister = manager.create(PreRegister, {
          email,
          attempts: 0,
          expiresAt: new Date(Date.now() + ms('15m')),
          jti: '',
          tokenHash: '',
        });
      } else if (isExpired) {
        preRegister.attempts = 0;
      }

      if (preRegister.attempts >= 5)
        throw new ConflictException(
          'The number of attempts has been exceeded; please try again after 15 minutes',
        );

      const tokenPayload = {
        jti: randomUUID(),
        tokenType: Jwtypes.REGISTER,
      };
      const verificationToken = await this.jwtGeneratorService.generateToken(
        tokenPayload,
        '10m',
      );
      const tokenHash = this.bcryptConfigService.hashSha256(verificationToken);

      preRegister.attempts += 1;
      preRegister.jti = tokenPayload.jti;
      preRegister.expiresAt = new Date(Date.now() + ms('15m'));
      preRegister.tokenHash = tokenHash;

      await manager.save(PreRegister, preRegister);

      await this.outbox.add(manager, {
        topic: 'send.verification.mail',
        payload: {
          email,
          verificationToken,
          jti: tokenPayload.jti,
        },
      });

      await queryRunner.commitTransaction();
      this.outbox.notify();

      return HandlerSuccessResponse.response(
        'Email pre-registered',
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (queryRunner.isTransactionActive)
        await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) throw error;

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
    const accessToken = await this.jwtGeneratorService.generateToken(
      accessTokenPayload,
      '15m',
    );
    const refreshToken = await this.jwtGeneratorService.generateToken(
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
        tokenType: Jwtypes.ACCESS,
      },
      refreshTokenPayload: {
        sub: id,
        jti: randomUUID(),
        tokenType: Jwtypes.REFRESH,
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

  public regenerateAccessToken(userJwtDto: UserJwtDto) {
    const { sub } = userJwtDto;
    const payload = {
      sub,
      tokenType: Jwtypes.ACCESS,
    };

    const accessToken = this.jwtGeneratorService.generateToken(payload, '15m');

    return HandlerSuccessResponse.response('Token regenerated', HttpStatus.OK, {
      accessToken,
    });
  }
}
