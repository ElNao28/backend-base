import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserJwtDto } from '../../common/dto/jwt-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity.js';
import { Repository } from 'typeorm';
import { BcryptConfigService } from '../../common/services/bcrypt.service.js';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly bcryptConfigService: BcryptConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userJwt = request.user as UserJwtDto;

    if (userJwt.tokenType !== 'refresh')
      throw new UnauthorizedException('Refresh token required');

    const foundToken = await this.refreshTokenRepository.findOne({
      where: {
        jti: userJwt.jti,
        revoked: false,
        user: {
          id: userJwt.sub,
        },
      },
    });

    if (!foundToken) throw new UnauthorizedException('Invalid token');

    const [, token] = (request.headers.authorization as string).split(' ');

    const isMatch = this.bcryptConfigService.compareSha256(
      token,
      foundToken.tokenHash,
    );

    if (!isMatch) throw new UnauthorizedException('Ivalid token');

    return true;
  }
}
