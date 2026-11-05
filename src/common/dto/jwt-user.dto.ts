export class UserJwtDto {
  sub: string;
  tokenType: 'refresh' | 'access';
  jti?: string;
}
