import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/authorization.decorator.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) as string[];
    
    if (!roles?.length) {
      throw new ForbiddenException('No roles configured for this endpoint');
    }

    const user = context.switchToHttp().getRequest().user;
    if (!user) throw new UnauthorizedException();

    const userFound = await this.userRepository.findOne({
      where: {
        id: user.sub,
      },
      relations: {
        roles: true,
      },
    });

    if (!userFound) throw new UnauthorizedException();

    const rolesName = userFound.roles.map((rol) => rol.name);

    const hasPermission = roles.some((rol) => rolesName.includes(rol));

    if (!hasPermission)
      throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
