import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { IS_REFRESH_ROUTE_KEY } from '../decorators/refresh-route.decorator.js';
import { UserJwtDto } from '../../common/dto/jwt-user.dto.js';
import { Jwtypes } from '../../common/constants/jwt-types.js';
import { IS_REGISTER_ROUTE_KEY } from '../decorators/register-route.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (!user.tokenType) throw new UnauthorizedException('Token invalid');

    const { tokenType } = user as UserJwtDto;

    const isRefreshRoute = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isRegisterRoute = this.reflector.getAllAndOverride<boolean>(
      IS_REGISTER_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isRefreshRoute) {
      if (tokenType !== Jwtypes.REFRESH) {
        throw new UnauthorizedException('Refresh token required');
      }

      return user;
    }

    if (isRegisterRoute) {
      if (tokenType !== Jwtypes.REGISTER) {
        throw new UnauthorizedException('Register token required');
      }

      return user;
    }

    if (tokenType !== Jwtypes.ACCESS) {
      throw new UnauthorizedException('Access token required');
    }

    return user;
  }
}
