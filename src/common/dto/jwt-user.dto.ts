import { Jwtypes } from '../constants/jwt-types.js';

export class UserJwtDto {
  sub: string;
  tokenType: Jwtypes;
  jti?: string;
}
