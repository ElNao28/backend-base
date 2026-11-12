import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGeneratorService {
  constructor(private readonly jwtService: JwtService) {}

  public generateToken(
    payload: { [key: string]: any },
    expiresIn: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: expiresIn as any,
    });
  }

  public verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
