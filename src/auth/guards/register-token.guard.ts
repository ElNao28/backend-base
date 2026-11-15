import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { PreRegister } from '../entities/pre-register.entity.js';
import { Repository } from 'typeorm';
import { BcryptConfigService } from '../../common/services/bcrypt.service.js';

interface TokenData {
  jti: string;
  tokenType: string;
}

@Injectable()
export class RegisterTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(PreRegister)
    private readonly preRegisterRepository: Repository<PreRegister>,
    private readonly bcryptCOnfigService: BcryptConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { jti } = request.user as TokenData;

    const foundRegister = await this.preRegisterRepository.findOne({
      where: {
        jti,
      },
    });
    if (!foundRegister) throw new UnauthorizedException('Token Invalid');

    const tokenHash = foundRegister.tokenHash;
    const authorizationHeader: string = context.switchToHttp().getRequest()
      .headers.authorization;
    const token: string = authorizationHeader.split(' ')[1];

    const isMatch = this.bcryptCOnfigService.compareSha256(token, tokenHash);

    if (!isMatch) throw new UnauthorizedException('Token invalid');

    return true;
  }
}
