import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { createHash, timingSafeEqual } from 'crypto';

@Injectable()
export class BcryptConfigService {
  constructor(private readonly configService: ConfigService) {}

  public hash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(+this.configService.get('envs.HASH_SALT'));
    return bcrypt.hash(password, salt);
  }

  public compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  public hashSha256(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  public compareSha256(token: string, tokenHash: string): boolean {
    const preparedToken = this.hashSha256(token);

    const preparedBuffer = Buffer.from(preparedToken, 'hex');
    const hashedBuffer = Buffer.from(tokenHash, 'hex');

    if (preparedBuffer.length !== hashedBuffer.length) {
      return false;
    }

    return timingSafeEqual(preparedBuffer, hashedBuffer);
  }
}
