import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGeneratorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public generateToken(
    payload: { [key: string]: any },
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn as any,
    });
  }

  public verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
