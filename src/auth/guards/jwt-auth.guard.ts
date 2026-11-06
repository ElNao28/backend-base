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
    const isRefreshRoute = this.reflector.getAllAndOverride(
      IS_REFRESH_ROUTE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const { tokenType } = user as UserJwtDto;

    if (!isRefreshRoute && tokenType !== 'access')
      throw new UnauthorizedException('Access token required');

    if (isRefreshRoute && tokenType !== 'refresh')
      throw new UnauthorizedException('Refresh token required');

    return user;
  }
}
